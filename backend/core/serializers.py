from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, PremiumKey, DocumentTemplate, Document, TemplateFill, TemplateField, SiteSettings, UsageLog


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ("is_email_verified", "usage_count", "is_premium", "premium_until")


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "is_staff", "profile")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


class PremiumKeyRedeemSerializer(serializers.Serializer):
    code = serializers.CharField()


class DocumentTemplateSerializer(serializers.ModelSerializer):
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
        fields = ("id", "key", "label", "field_type", "required", "mapping")


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
        )


class UsageLogSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = UsageLog
        fields = ("id", "user", "action", "created_at", "metadata")
