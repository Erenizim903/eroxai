from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, PremiumKey, DocumentTemplate, Document, TemplateFill


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ("is_email_verified", "usage_count", "is_premium", "premium_until")


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "profile")


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
    class Meta:
        model = DocumentTemplate
        fields = ("id", "name", "description", "file", "fields_schema", "created_at")


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = (
            "id",
            "file",
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
        fields = ("id", "template", "input_data", "output_data", "created_at")
