from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path("auth/register/", views.register),
    path("auth/verify/", views.verify_email),
    path("auth/login/", views.login),
    path("auth/refresh/", TokenRefreshView.as_view()),
    path("auth/me/", views.me),
    path("auth/redeem-key/", views.redeem_key),
    path("documents/upload/", views.upload_document),
    path("documents/<int:doc_id>/ocr/", views.run_ocr),
    path("documents/<int:doc_id>/translate/", views.translate_document),
    path("documents/full-translate/", views.full_translate),
    path("templates/", views.list_templates),
    path("templates/create/", views.create_template),
    path("templates/<int:template_id>/fill/", views.fill_template),
]
