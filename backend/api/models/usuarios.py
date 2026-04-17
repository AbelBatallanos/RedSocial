from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
from .base import TimeStampedModel

class UsuarioManager(BaseUserManager):
    def create_user(self, correo, nombre_usuario, password=None, **extra_fields):
        if not correo:
            raise ValueError('El correo es obligatorio')
        correo = self.normalize_email(correo)
        user = self.model(correo=correo, nombre_usuario=nombre_usuario, **extra_fields)
        user.set_password(password) # Encripta la contraseña
        user.save(using=self._db)
        return user

    def create_superuser(self, correo, nombre_usuario, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(correo, nombre_usuario, password, **extra_fields)

class UsuarioEstado(models.TextChoices):
    ACTIVE = "active", "active"
    SUSPENDED = "suspended", "suspended"
    DELETED = "deleted", "deleted"

class Usuario(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    nombre_usuario = models.CharField(max_length=150, unique=True)
    correo = models.EmailField(unique=True)
    
    # Atributos personalizados
    fecha_nacimiento = models.DateField(null=True, blank=True)
    biografia = models.TextField(null=True, blank=True)
    avatar = models.ImageField(upload_to='usuarios/avatars/', null=True, blank=True)
    estado = models.CharField(
        max_length=20,
        choices=UsuarioEstado.choices,
        default=UsuarioEstado.ACTIVE,
    )
    has_premium = models.BooleanField(default=False)

    # Campos obligatorios para Django Admin/Auth
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    # Conexión con el Manager
    objects = UsuarioManager()

    USERNAME_FIELD = 'correo' 
    REQUIRED_FIELDS = ['nombre_usuario']

    class Meta:
        db_table = "usuarios"

    def __str__(self):
        return self.nombre_usuario