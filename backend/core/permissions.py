from rest_framework.permissions import BasePermission


class IsVerifiedEmail(BasePermission):
    message = "Email not verified."

    def has_permission(self, request, view):
        profile = getattr(request.user, "profile", None)
        return bool(profile and profile.is_email_verified)
