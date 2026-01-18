import uuid
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.core.signing import Signer, BadSignature
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Document, DocumentTemplate, PremiumKey, TemplateFill, UsageLog
from .permissions import IsVerifiedEmail
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    DocumentSerializer,
    DocumentTemplateSerializer,
    PremiumKeyRedeemSerializer,
    TemplateFillSerializer,
)
from .services.file_processing import file_to_base64, extract_text_from_pdf, is_image_file
from .services.openai_service import translate_text
from .services.utils import validate_email_domain, request_google_vision_text

signer = Signer()


def issue_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {"refresh": str(refresh), "access": str(refresh.access_token)}


def check_usage_limit(user):
    profile = user.profile
    if profile.is_premium:
        return True
    return profile.usage_count < settings.FREE_USAGE_LIMIT


def increment_usage(user, action, metadata=None):
    profile = user.profile
    profile.usage_count += 1
    profile.save(update_fields=["usage_count"])
    UsageLog.objects.create(user=user, action=action, metadata=metadata or {})


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.validated_data["email"]
    if not validate_email_domain(email):
        return Response({"error": "Email domain is invalid."}, status=status.HTTP_400_BAD_REQUEST)
    user = serializer.save()
    token = signer.sign(str(user.id))
    verify_url = f"{request.data.get('verifyBaseUrl','')}/verify-email?token={token}"
    if settings.EMAIL_HOST:
        send_mail(
            "Verify your account",
            f"Click to verify: {verify_url}",
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=True,
        )
    return Response({"message": "Registered. Verify your email.", "token": token})


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_email(request):
    token = request.data.get("token")
    if not token:
        return Response({"error": "Token required."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user_id = signer.unsign(token)
    except BadSignature:
        return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
    user = get_object_or_404(User, id=user_id)
    user.profile.is_email_verified = True
    user.profile.save(update_fields=["is_email_verified"])
    return Response({"message": "Email verified."})


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if not user:
        return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({"user": UserSerializer(user).data, "tokens": issue_tokens(user)})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def redeem_key(request):
    serializer = PremiumKeyRedeemSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    code = serializer.validated_data["code"]
    premium_key = get_object_or_404(PremiumKey, code=code, is_active=True)
    if premium_key.used_count >= premium_key.max_uses:
        return Response({"error": "Key already used."}, status=status.HTTP_400_BAD_REQUEST)
    premium_key.used_count += 1
    premium_key.save(update_fields=["used_count"])
    profile = request.user.profile
    profile.is_premium = True
    profile.save(update_fields=["is_premium"])
    return Response({"message": "Premium activated."})


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsVerifiedEmail])
def upload_document(request):
    if not check_usage_limit(request.user):
        return Response({"error": "Free usage limit reached."}, status=status.HTTP_403_FORBIDDEN)
    file_obj = request.FILES.get("file")
    if not file_obj:
        return Response({"error": "File required."}, status=status.HTTP_400_BAD_REQUEST)
    doc = Document.objects.create(
        uploaded_by=request.user,
        file=file_obj,
        source_language=request.data.get("source_language", "auto"),
        target_language="ja",
    )
    return Response(DocumentSerializer(doc).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsVerifiedEmail])
def run_ocr(request, doc_id):
    doc = get_object_or_404(Document, id=doc_id, uploaded_by=request.user)
    if not check_usage_limit(request.user):
        return Response({"error": "Free usage limit reached."}, status=status.HTTP_403_FORBIDDEN)
    file_path = doc.file.path
    text = ""
    if is_image_file(doc.file.name):
        with open(file_path, "rb") as file_obj:
            base64_img = file_to_base64(file_obj)
        text = request_google_vision_text(base64_img, request.data.get("language_hint"))
    elif doc.file.name.lower().endswith(".pdf"):
        text = extract_text_from_pdf(file_path)
        if not text:
            return Response({"error": "PDF OCR requires Vision async setup."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Unsupported file type."}, status=status.HTTP_400_BAD_REQUEST)
    doc.extracted_text = text
    doc.status = "ocr_done"
    doc.save(update_fields=["extracted_text", "status"])
    increment_usage(request.user, "ocr", {"document": doc.id})
    return Response(DocumentSerializer(doc).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsVerifiedEmail])
def translate_document(request, doc_id):
    doc = get_object_or_404(Document, id=doc_id, uploaded_by=request.user)
    if not check_usage_limit(request.user):
        return Response({"error": "Free usage limit reached."}, status=status.HTTP_403_FORBIDDEN)
    text = doc.extracted_text or request.data.get("text", "")
    translated = translate_text(text, doc.source_language, "ja")
    doc.translated_text = translated
    doc.status = "translated"
    doc.save(update_fields=["translated_text", "status"])
    increment_usage(request.user, "translate", {"document": doc.id})
    return Response(DocumentSerializer(doc).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def list_templates(request):
    templates = DocumentTemplate.objects.all().order_by("-created_at")
    return Response(DocumentTemplateSerializer(templates, many=True).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsVerifiedEmail])
def create_template(request):
    serializer = DocumentTemplateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    template = serializer.save(created_by=request.user)
    return Response(DocumentTemplateSerializer(template).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsVerifiedEmail])
def fill_template(request, template_id):
    template = get_object_or_404(DocumentTemplate, id=template_id)
    if not check_usage_limit(request.user):
        return Response({"error": "Free usage limit reached."}, status=status.HTTP_403_FORBIDDEN)
    input_data = request.data.get("input_data", {})
    output_data = {}
    for key, value in input_data.items():
        output_data[key] = translate_text(str(value), "auto", "ja")
    fill = TemplateFill.objects.create(
        template=template,
        user=request.user,
        input_data=input_data,
        output_data=output_data,
    )
    increment_usage(request.user, "fill_template", {"template": template.id})
    return Response(TemplateFillSerializer(fill).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsVerifiedEmail])
def full_translate(request):
    if not check_usage_limit(request.user):
        return Response({"error": "Free usage limit reached."}, status=status.HTTP_403_FORBIDDEN)
    text = request.data.get("text", "")
    source = request.data.get("source_language", "auto")
    translated = translate_text(text, source, "ja")
    increment_usage(request.user, "full_translate")
    return Response({"translated_text": translated})
