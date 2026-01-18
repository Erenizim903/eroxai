from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    is_email_verified = models.BooleanField(default=False)
    usage_count = models.PositiveIntegerField(default=0)
    is_premium = models.BooleanField(default=False)
    premium_until = models.DateTimeField(null=True, blank=True)
    phone = models.CharField(max_length=40, blank=True)
    company = models.CharField(max_length=120, blank=True)
    title = models.CharField(max_length=120, blank=True)
    address = models.TextField(blank=True)
    locale = models.CharField(max_length=8, default="tr")
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)

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


class PremiumKeyRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="premium_requests")
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    admin_note = models.TextField(blank=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="approved_requests")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.status}"


class DocumentTemplate(models.Model):
    TEMPLATE_TYPES = [
        ("pdf", "PDF"),
        ("xlsx", "Excel"),
        ("blank", "Blank"),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    template_type = models.CharField(max_length=16, choices=TEMPLATE_TYPES, default="pdf")
    file = models.FileField(upload_to="templates/", null=True, blank=True)
    output_language = models.CharField(max_length=8, default="ja")
    fields_schema = models.JSONField(default=list, blank=True)
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
    file_type = models.CharField(max_length=16, default="pdf")
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
    output_file = models.FileField(upload_to="outputs/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class UsageLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict)


class UserActivityLog(models.Model):
    ACTION_CHOICES = [
        ("login", "Login"),
        ("logout", "Logout"),
        ("register", "Register"),
        ("password_reset", "Password Reset"),
        ("profile_update", "Profile Update"),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activity_logs")
    action = models.CharField(max_length=32, choices=ACTION_CHOICES)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["-created_at"]),
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["action", "-created_at"]),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.action} - {self.created_at}"


class AIChatLog(models.Model):
    """AI chat mesajlarını loglar - 3 gün sonra otomatik silinir"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ai_chat_logs")
    message = models.TextField()
    response = models.TextField()
    language = models.CharField(max_length=8, default="tr")
    provider = models.CharField(max_length=20, default="openai")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["-created_at"]),
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["created_at"]),  # 3 günlük silme için
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.created_at}"


class TemplateField(models.Model):
    FIELD_TYPES = [
        ("text", "Text"),
        ("date", "Date"),
        ("number", "Number"),
        ("select", "Select"),
    ]

    template = models.ForeignKey(DocumentTemplate, on_delete=models.CASCADE, related_name="fields")
    key = models.CharField(max_length=80)
    label = models.CharField(max_length=200)
    field_type = models.CharField(max_length=16, choices=FIELD_TYPES, default="text")
    required = models.BooleanField(default=False)
    mapping = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.template.name}::{self.key}"


class SiteSettings(models.Model):
    site_name = models.CharField(max_length=120, default="EroxAI")
    logo = models.ImageField(upload_to="branding/", null=True, blank=True)
    contact_email = models.CharField(max_length=120, blank=True)
    contact_phone = models.CharField(max_length=60, blank=True)
    contact_whatsapp = models.CharField(max_length=60, blank=True)
    address = models.TextField(blank=True)
    hero_title = models.CharField(max_length=200, blank=True)
    hero_subtitle = models.TextField(blank=True)
    copyright_text = models.CharField(max_length=200, default="© 2026 EroxAI Studio. Tüm hakları saklıdır.")
    social_facebook = models.CharField(max_length=200, blank=True)
    social_instagram = models.CharField(max_length=200, blank=True)
    social_twitter = models.CharField(max_length=200, blank=True)
    social_linkedin = models.CharField(max_length=200, blank=True)
    social_youtube = models.CharField(max_length=200, blank=True)
    social_github = models.CharField(max_length=200, blank=True)
    social_telegram = models.CharField(max_length=200, blank=True)
    # AI API Endpoints
    google_ai_endpoint = models.CharField(max_length=500, default="https://vision.googleapis.com/v1/images:annotate", blank=True)
    openai_endpoint = models.CharField(max_length=500, default="https://api.openai.com/v1/chat/completions", blank=True)
    deepseek_endpoint = models.CharField(max_length=500, default="https://api.deepseek.com/v1/chat/completions", blank=True)
    blackbox_endpoint = models.CharField(max_length=500, default="https://www.blackbox.ai/api/chat", blank=True)
    # AI Chat Provider (openai, deepseek, blackbox)
    chat_provider = models.CharField(max_length=20, default="openai", blank=True)
    # Theme Settings (sadece admin ayarlayabilir)
    theme_primary_color = models.CharField(max_length=20, default="#667eea", blank=True)
    theme_secondary_color = models.CharField(max_length=20, default="#764ba2", blank=True)
    theme_preset = models.CharField(max_length=20, default="ocean", blank=True)
    # Site Content Texts (Admin Panelden Yönetilebilir - TR/EN/JA)
    site_texts = models.JSONField(default=dict, blank=True)
    # Homepage Sections (Hero, Features, About, etc.)
    homepage_sections = models.JSONField(default=dict, blank=True)
    # Chat UI Texts
    chat_texts = models.JSONField(default=dict, blank=True)
    # Navigation & Common Texts
    navigation_texts = models.JSONField(default=dict, blank=True)
    # Dashboard & User Panel Texts
    dashboard_texts = models.JSONField(default=dict, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
