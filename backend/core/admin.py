from django.contrib import admin
from .models import UserProfile, PremiumKey, DocumentTemplate, Document, TemplateFill, UsageLog


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "is_email_verified", "usage_count", "is_premium", "premium_until")
    search_fields = ("user__username", "user__email")


@admin.register(PremiumKey)
class PremiumKeyAdmin(admin.ModelAdmin):
    list_display = ("code", "is_active", "max_uses", "used_count", "expires_at")
    search_fields = ("code",)


@admin.register(DocumentTemplate)
class DocumentTemplateAdmin(admin.ModelAdmin):
    list_display = ("name", "created_by", "created_at")
    search_fields = ("name",)


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "uploaded_by", "status", "created_at")
    search_fields = ("id", "uploaded_by__username")


@admin.register(TemplateFill)
class TemplateFillAdmin(admin.ModelAdmin):
    list_display = ("template", "user", "created_at")


@admin.register(UsageLog)
class UsageLogAdmin(admin.ModelAdmin):
    list_display = ("user", "action", "created_at")
