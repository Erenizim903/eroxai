from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


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

    # Multilingual fields
    name_ja = models.CharField(max_length=200, blank=True)
    name_tr = models.CharField(max_length=200)
    name_en = models.CharField(max_length=200, blank=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    description_ja = models.TextField(blank=True)
    description_tr = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    
    # Category relationship
    category = models.ForeignKey("DocumentCategory", on_delete=models.SET_NULL, null=True, blank=True, related_name="templates")
    
    # Existing fields
    template_type = models.CharField(max_length=16, choices=TEMPLATE_TYPES, default="pdf")
    file = models.FileField(upload_to="templates/", null=True, blank=True)
    preview_image = models.ImageField(upload_to="template_previews/", null=True, blank=True)
    output_language = models.CharField(max_length=8, default="ja")
    fields_schema = models.JSONField(default=list, blank=True)
    is_premium_only = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["category", "name_tr"]

    def __str__(self):
        return self.name_tr or self.name_ja or f"Template {self.id}"


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
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.template.name}::{self.key}"


class SiteSettings(models.Model):
    site_name = models.CharField(max_length=120, default="EroxAI Studio")
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


# ============================================================================
# SUBSCRIPTION SYSTEM MODELS
# ============================================================================

class SubscriptionPlan(models.Model):
    """Abonelik planları (Monthly, Yearly)"""
    name = models.CharField(max_length=50)  # 'monthly', 'yearly'
    display_name_ja = models.CharField(max_length=100, blank=True)
    display_name_tr = models.CharField(max_length=100, blank=True)
    display_name_en = models.CharField(max_length=100, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="JPY")
    duration_days = models.IntegerField()  # 30 for monthly, 365 for yearly
    features = models.JSONField(default=list, blank=True)  # Premium features list
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["price"]

    def __str__(self):
        return f"{self.name} - {self.price} {self.currency}"


class Subscription(models.Model):
    """Kullanıcı abonelikleri"""
    PLAN_TYPE_CHOICES = [
        ("free", "Free"),
        ("premium", "Premium"),
    ]
    STATUS_CHOICES = [
        ("active", "Active"),
        ("cancelled", "Cancelled"),
        ("expired", "Expired"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="subscription")
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPE_CHOICES, default="free")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True, blank=True, related_name="subscriptions")
    started_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    payment_provider = models.CharField(max_length=20, blank=True, null=True)  # 'stripe', 'paypal'
    payment_id = models.CharField(max_length=200, blank=True, null=True)  # Payment transaction ID
    cancelled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.plan_type} - {self.status}"

    def is_active(self):
        """Check if subscription is currently active"""
        if self.status != "active":
            return False
        if self.expires_at and self.expires_at < timezone.now():
            return False
        return True


# ============================================================================
# DOCUMENT LIBRARY MODELS
# ============================================================================

class DocumentCategory(models.Model):
    """Belge kategorileri (Japon inşaat belgeleri için)"""
    name_ja = models.CharField(max_length=200)
    name_tr = models.CharField(max_length=200)
    name_en = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description_ja = models.TextField(blank=True)
    description_tr = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True, null=True)  # Icon name or emoji
    sort_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "name_tr"]
        verbose_name_plural = "Document Categories"

    def __str__(self):
        return self.name_tr


# DocumentTemplate model'ini güncelle - category ekle
# (Mevcut DocumentTemplate model'ine category field ekleyeceğiz)


class UserDocument(models.Model):
    """Kullanıcıların doldurduğu belgeler"""
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("completed", "Completed"),
        ("archived", "Archived"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_documents")
    template = models.ForeignKey(DocumentTemplate, on_delete=models.CASCADE, related_name="filled_documents")
    filled_data = models.JSONField(default=dict)  # User filled form data
    output_file = models.FileField(upload_to="user_documents/", null=True, blank=True)
    language = models.CharField(max_length=8, default="tr")  # Input language (tr, en)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.template.name} - {self.status}"


# ============================================================================
# AI CHAT SESSION MODELS
# ============================================================================

class AIChatSession(models.Model):
    """AI sohbet oturumları"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ai_chat_sessions")
    title = models.CharField(max_length=200, blank=True, null=True)
    language = models.CharField(max_length=8, default="tr")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.user.username} - {self.title or f'Session {self.id}'}"


class AIChatMessage(models.Model):
    """AI sohbet mesajları"""
    ROLE_CHOICES = [
        ("user", "User"),
        ("assistant", "Assistant"),
    ]

    session = models.ForeignKey(AIChatSession, on_delete=models.CASCADE, related_name="messages")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)  # Additional data (tokens, model, etc.)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.session.user.username} - {self.role} - {self.created_at}"


# ============================================================================
# OCR & TRANSLATION MODELS
# ============================================================================

class OCRDocument(models.Model):
    """OCR işlemi yapılan belgeler"""
    STATUS_CHOICES = [
        ("processing", "Processing"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ocr_documents")
    original_file = models.FileField(upload_to="ocr_documents/")
    extracted_text = models.TextField(blank=True)
    source_language = models.CharField(max_length=8, default="ja")
    target_language = models.CharField(max_length=8, default="tr")
    translated_text = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="processing")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"OCR Document {self.id} - {self.user.username}"


# ============================================================================
# CALCULATOR TOOLS MODELS
# ============================================================================

class CalculatorLog(models.Model):
    """Hesaplama araçları kullanım logları"""
    CALCULATOR_TYPES = [
        ("ryoshusho", "Ryoshusho (領収書)"),
        ("subo", "Subo (砂利/Çakıl)"),
        ("beton", "Beton (Concrete)"),
        ("tatami", "Tatami (畳)"),
        ("tsubo", "Tsubo (坪)"),
        ("material", "Material Cost"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="calculator_logs")
    calculator_type = models.CharField(max_length=20, choices=CALCULATOR_TYPES)
    input_data = models.JSONField(default=dict)  # Input parameters
    result_data = models.JSONField(default=dict)  # Calculation results
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.calculator_type} - {self.created_at}"


# ============================================================================
# SITE CONTENT TRANSLATIONS
# ============================================================================

class SiteContentTranslation(models.Model):
    """Site içeriği çevirileri (TR/EN/JA)"""
    LANGUAGE_CHOICES = [
        ("tr", "Turkish"),
        ("en", "English"),
        ("ja", "Japanese"),
    ]

    key = models.CharField(max_length=200)  # Translation key
    language = models.CharField(max_length=8, choices=LANGUAGE_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["key", "language"]
        ordering = ["key", "language"]

    def __str__(self):
        return f"{self.key} - {self.language}"


# ============================================================================
# THEME MANAGEMENT
# ============================================================================

class Theme(models.Model):
    """Site temaları"""
    name = models.CharField(max_length=100)
    primary_color = models.CharField(max_length=20, default="#667eea")
    secondary_color = models.CharField(max_length=20, default="#764ba2")
    preset = models.CharField(max_length=20, default="ocean")
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_active", "name"]

    def __str__(self):
        return self.name
