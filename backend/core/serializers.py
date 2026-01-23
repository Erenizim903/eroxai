from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, PremiumKey, DocumentTemplate, Document, TemplateFill, TemplateField, SiteSettings, UsageLog, PremiumKeyRequest, UserActivityLog, AIChatLog, SupportRequest


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = (
            "is_email_verified",
            "usage_count",
            "is_premium",
            "premium_until",
            "phone",
            "company",
            "title",
            "address",
            "locale",
            "avatar",
        )


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "is_staff", "profile")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("username", "email", "password", "first_name", "last_name")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


class PremiumKeyRedeemSerializer(serializers.Serializer):
    code = serializers.CharField()


class ProfileUpdateSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    company = serializers.CharField(required=False, allow_blank=True)
    title = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    locale = serializers.CharField(required=False, allow_blank=True)


class DocumentTemplateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="name_tr")
    description = serializers.CharField(source="description_tr", allow_blank=True, required=False)
    fields = serializers.SerializerMethodField()

    class Meta:
        model = DocumentTemplate
        fields = (
            "id",
            "name",
            "description",
            "template_type",
            "file",
            "output_language",
            "fields_schema",
            "fields",
            "created_at",
        )

    def get_fields(self, obj):
        return TemplateFieldSerializer(obj.fields.all(), many=True).data


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = (
            "id",
            "file",
            "file_type",
            "source_language",
            "target_language",
            "extracted_text",
            "translated_text",
            "status",
            "created_at",
        )


class TemplateFillSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateFill
        fields = ("id", "template", "input_data", "output_data", "output_file", "created_at")


class TemplateFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateField
        fields = ("id", "key", "label", "field_type", "required", "mapping", "order")


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = (
            "site_name",
            "logo",
            "contact_email",
            "contact_phone",
            "contact_whatsapp",
            "address",
            "hero_title",
            "hero_subtitle",
            "copyright_text",
            "social_facebook",
            "social_instagram",
            "social_twitter",
            "social_linkedin",
            "social_youtube",
            "social_github",
            "social_telegram",
            "google_ai_endpoint",
            "openai_endpoint",
            "deepseek_endpoint",
            "blackbox_endpoint",
            "chat_provider",
            "theme_primary_color",
            "theme_secondary_color",
            "theme_preset",
            "site_texts",
            "homepage_sections",
            "chat_texts",
            "navigation_texts",
            "dashboard_texts",
        )


class ApiKeysSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = (
            "openai_api_key",
            "google_vision_api_key",
            "deepseek_api_key",
            "blackbox_api_key",
            "blackbox_repo_url",
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        payload = {}
        for key, value in data.items():
            if key == "blackbox_repo_url":
                payload[key] = value or ""
            else:
                payload[key] = ""
                payload[f"{key}_set"] = bool(value)
        return payload


class SupportRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportRequest
        fields = (
            "id",
            "user",
            "username",
            "email",
            "reason",
            "status",
            "ip_address",
            "user_agent",
            "created_at",
            "updated_at",
        )


class UsageLogSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = UsageLog
        fields = ("id", "user", "action", "created_at", "metadata")


class PremiumKeyRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)
    approved_by_username = serializers.CharField(source="approved_by.username", read_only=True)

    class Meta:
        model = PremiumKeyRequest
        fields = (
            "id",
            "user",
            "user_id",
            "reason",
            "status",
            "admin_note",
            "approved_by_username",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("status", "approved_by", "created_at", "updated_at")


class UserActivityLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = UserActivityLog
        fields = (
            "id",
            "user",
            "username",
            "action",
            "ip_address",
            "user_agent",
            "created_at",
            "metadata",
        )


class AIChatLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = AIChatLog
        fields = (
            "id",
            "user",
            "username",
            "message",
            "response",
            "language",
            "provider",
            "ip_address",
            "user_agent",
            "created_at",
        )
