from django.db import models

from .base import TimeStampedModel


class UsuarioEstado(models.TextChoices):
    ACTIVE = "active", "active"
    SUSPENDED = "suspended", "suspended"
    DELETED = "deleted", "deleted"


class Usuario(TimeStampedModel):
    nombre_usuario = models.CharField(max_length=150, unique=True)
    correo = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    biografia = models.TextField(null=True, blank=True)
    avatar = models.URLField(max_length=500, null=True, blank=True)
    estado = models.CharField(
        max_length=20,
        choices=UsuarioEstado.choices,
        default=UsuarioEstado.ACTIVE,
    )

    class Meta:
        db_table = "usuarios"

    def __str__(self):
        return self.nombre_usuario
