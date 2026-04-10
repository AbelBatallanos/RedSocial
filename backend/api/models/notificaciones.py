from django.db import models

from .base import TimeStampedModel
from .usuarios import Usuario


class Notificacion(TimeStampedModel):
    user_destino = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="notificaciones",
    )
    tipo = models.CharField(max_length=100)
    payload_json = models.JSONField()
    leido = models.BooleanField(default=False)

    class Meta:
        db_table = "notificaciones"
