from django.conf import settings
from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    is_email_verified = models.BooleanField(default=False)
    usage_count = models.PositiveIntegerField(default=0)
    is_premium = models.BooleanField(default=False)
    premium_until = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} profile"


class PremiumKey(models.Model):
    code = models.CharField(max_length=64, unique=True)
    is_active = models.BooleanField(default=True)
    max_uses = models.PositiveIntegerField(default=1)
    used_count = models.PositiveIntegerField(default=0)
    expires_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.code


class DocumentTemplate(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to="templates/")
    fields_schema = models.JSONField(default=list)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Document(models.Model):
    STATUS_CHOICES = [
        ("uploaded", "Uploaded"),
        ("ocr_done", "OCR Done"),
        ("translated", "Translated"),
    ]

    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    file = models.FileField(upload_to="documents/")
    source_language = models.CharField(max_length=8, default="auto")
    target_language = models.CharField(max_length=8, default="ja")
    extracted_text = models.TextField(blank=True)
    translated_text = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="uploaded")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Document {self.id}"


class TemplateFill(models.Model):
    template = models.ForeignKey(DocumentTemplate, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    input_data = models.JSONField(default=dict)
    output_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)


class UsageLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict)
