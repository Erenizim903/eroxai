import uuid
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserProfile, PremiumKey


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
        # Yeni kullanıcıya otomatik kısıtlı key ver (1 kullanım hakkı)
        key_code = f"TRIAL-{uuid.uuid4().hex[:12].upper()}"
        PremiumKey.objects.create(code=key_code, max_uses=1, is_active=True)
