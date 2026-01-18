from django.contrib import admin
from django.utils.crypto import get_random_string
from .models import (
    UserProfile,
    PremiumKey,
    PremiumKeyRequest,
    DocumentTemplate,
    Document,
    TemplateFill,
    UsageLog,
    UserActivityLog,
    AIChatLog,
    TemplateField,
    SiteSettings,
)


class TemplateFieldInline(admin.TabularInline):
    model = TemplateField
    extra = 1


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "is_email_verified", "usage_count", "is_premium", "premium_until")
    search_fields = ("user__username", "user__email")


@admin.register(PremiumKey)
class PremiumKeyAdmin(admin.ModelAdmin):
    list_display = ("code", "is_active", "max_uses", "used_count", "expires_at")
    search_fields = ("code",)
    actions = ["generate_keys"]

    @admin.action(description="Generate premium keys")
    def generate_keys(self, request, queryset):
        for _ in range(10):
            PremiumKey.objects.create(code=get_random_string(32))


@admin.register(DocumentTemplate)
class DocumentTemplateAdmin(admin.ModelAdmin):
    list_display = ("name", "template_type", "output_language", "created_by", "created_at")
    search_fields = ("name",)
    inlines = [TemplateFieldInline]


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "uploaded_by", "status", "created_at")
    search_fields = ("id", "uploaded_by__username")


@admin.register(TemplateFill)
class TemplateFillAdmin(admin.ModelAdmin):
    list_display = ("template", "user", "created_at", "output_file")


@admin.register(UsageLog)
class UsageLogAdmin(admin.ModelAdmin):
    list_display = ("user", "action", "created_at")


@admin.register(TemplateField)
class TemplateFieldAdmin(admin.ModelAdmin):
    list_display = ("template", "key", "field_type", "required")
    search_fields = ("template__name", "key")


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ("site_name", "contact_email", "contact_phone", "updated_at")


@admin.register(PremiumKeyRequest)
class PremiumKeyRequestAdmin(admin.ModelAdmin):
    list_display = ("user", "status", "created_at", "approved_by", "updated_at")
    list_filter = ("status", "created_at")
    search_fields = ("user__username", "user__email", "reason")
    readonly_fields = ("created_at", "updated_at")


@admin.register(UserActivityLog)
class UserActivityLogAdmin(admin.ModelAdmin):
    list_display = ("user", "action", "ip_address", "created_at")
    list_filter = ("action", "created_at")
    search_fields = ("user__username", "ip_address", "user_agent")
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"


@admin.register(AIChatLog)
class AIChatLogAdmin(admin.ModelAdmin):
    list_display = ("user", "provider", "language", "ip_address", "created_at")
    list_filter = ("provider", "language", "created_at")
    search_fields = ("user__username", "message", "response", "ip_address")
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"
    ordering = ["-created_at"]
