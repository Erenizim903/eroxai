from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.core.signing import Signer, BadSignature
from django.core.files import File
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Document, DocumentTemplate, PremiumKey, TemplateFill, UsageLog, SiteSettings, TemplateField
from .permissions import IsVerifiedEmail, IsAdminUser
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    DocumentSerializer,
    DocumentTemplateSerializer,
    PremiumKeyRedeemSerializer,
    TemplateFillSerializer,
    SiteSettingsSerializer,
    UsageLogSerializer,
    TemplateFieldSerializer,
)
from .services.file_processing import get_file_type
from .services.ocr_service import run_google_vision_ocr
from .services.openai_service import translate_text
from .services.template_render import render_pdf, render_xlsx, render_blank, render_free_text
from .services.utils import validate_email_domain
from openpyxl import load_workbook
import xlrd

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
    file_type = get_file_type(file_obj.name)
    if file_type == "unknown":
        return Response({"error": "Unsupported file type."}, status=status.HTTP_400_BAD_REQUEST)
    doc = Document.objects.create(
        uploaded_by=request.user,
        file=file_obj,
        file_type=file_type,
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
    if doc.file_type in ["pdf", "image"]:
        text = run_google_vision_ocr(file_path, doc.file_type, request.data.get("language_hint"))
    elif doc.file_type == "xlsx":
        chunks = []
        try:
            workbook = load_workbook(file_path, data_only=True)
            for sheet in workbook.worksheets:
                for row in sheet.iter_rows(values_only=True):
                    row_text = " ".join([str(cell) for cell in row if cell is not None])
                    if row_text.strip():
                        chunks.append(row_text)
        except Exception:
            legacy = xlrd.open_workbook(file_path)
            for sheet in legacy.sheets():
                for row_idx in range(sheet.nrows):
                    row_values = sheet.row_values(row_idx)
                    row_text = " ".join([str(cell) for cell in row_values if cell not in ["", None]])
                    if row_text.strip():
                        chunks.append(row_text)
        text = "\n".join(chunks)
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
    translated = translate_text(text, doc.source_language, doc.target_language or "ja")
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
@permission_classes([IsAuthenticated, IsVerifiedEmail, IsAdminUser])
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
        output_data[key] = translate_text(str(value), "auto", template.output_language or "ja")

    fields = list(template.fields.all())
    if template.template_type == "pdf" and template.file:
        output_path = render_pdf(template.file.path, fields, output_data)
    elif template.template_type == "xlsx":
        output_path = render_xlsx(template.file.path if template.file else None, fields, output_data)
    else:
        output_path = render_blank(output_data, fields)

    fill = TemplateFill.objects.create(
        template=template,
        user=request.user,
        input_data=input_data,
        output_data=output_data,
    )
    with open(output_path, "rb") as handle:
        fill.output_file.save(output_path.name, File(handle), save=True)
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


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsVerifiedEmail])
def blank_document(request):
    if not check_usage_limit(request.user):
        return Response({"error": "Free usage limit reached."}, status=status.HTTP_403_FORBIDDEN)
    text = request.data.get("text", "")
    source = request.data.get("source_language", "auto")
    title = request.data.get("title", "Translated Document")
    translated = translate_text(text, source, "ja")
    output_path = render_free_text(translated, title=title)
    increment_usage(request.user, "blank_document")
    return Response({"output_file": f"{settings.MEDIA_URL}outputs/{output_path.name}"})


@api_view(["GET"])
@permission_classes([AllowAny])
def site_settings(request):
    settings_obj, _ = SiteSettings.objects.get_or_create(id=1)
    return Response(SiteSettingsSerializer(settings_obj).data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_site_settings(request):
    settings_obj, _ = SiteSettings.objects.get_or_create(id=1)
    serializer = SiteSettingsSerializer(settings_obj, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_users(request):
    users = User.objects.all().order_by("-date_joined")
    return Response(UserSerializer(users, many=True).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_create_user(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    if request.data.get("is_staff"):
        user.is_staff = True
    if request.data.get("is_superuser"):
        user.is_superuser = True
    user.is_active = request.data.get("is_active", True)
    user.save()
    return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_delete_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    user.delete()
    return Response({"message": "User deleted."})


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_logs(request):
    logs = UsageLog.objects.all().order_by("-created_at")[:500]
    return Response(UsageLogSerializer(logs, many=True).data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_premium_keys(request):
    if request.method == "GET":
        keys = PremiumKey.objects.all().order_by("-id")
        return Response(
            [{"id": k.id, "code": k.code, "is_active": k.is_active, "used_count": k.used_count, "max_uses": k.max_uses} for k in keys]
        )
    code = request.data.get("code")
    max_uses = int(request.data.get("max_uses", 1))
    key = PremiumKey.objects.create(code=code or uuid.uuid4().hex, max_uses=max_uses)
    return Response({"id": key.id, "code": key.code})


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_add_template_field(request, template_id):
    template = get_object_or_404(DocumentTemplate, id=template_id)
    serializer = TemplateFieldSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    field = serializer.save(template=template)
    return Response(TemplateFieldSerializer(field).data, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_delete_template_field(request, template_id, field_id):
    field = get_object_or_404(TemplateField, id=field_id, template_id=template_id)
    field.delete()
    return Response({"message": "Field deleted."})


@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_update_template_field(request, template_id, field_id):
    field = get_object_or_404(TemplateField, id=field_id, template_id=template_id)
    serializer = TemplateFieldSerializer(field, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)
