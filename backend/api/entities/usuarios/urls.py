from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, LogoutView

urlpatterns = [
    # --- LOGIN ---
    # Le envías {"correo": "...", "password": "..."} y te devuelve el JWT
    path('login/', TokenObtainPairView.as_view(), name='login'), 
    
    # --- REGISTER ---
    path('register/', RegisterView.as_view(), name='register'),
    
    # --- LOGOUT ---
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # --- REFRESH TOKEN ---
    # Sirve para pedir un token nuevo cuando el anterior caduca (sin volver a pedir contraseña)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]