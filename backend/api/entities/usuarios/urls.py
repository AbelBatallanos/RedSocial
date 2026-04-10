from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import LoginAPIView, LogoutAPIView, RegisterAPIView, UsuarioViewSet

router = DefaultRouter()
router.register(r"", UsuarioViewSet, basename="usuarios")

urlpatterns = [
    path("auth/register/", RegisterAPIView.as_view(), name="register"),
    path("auth/login/", LoginAPIView.as_view(), name="login"),
    path("auth/logout/", LogoutAPIView.as_view(), name="logout"),
]

urlpatterns += router.urls
