from django.db import models

from .base import TimeStampedModel
from .usuarios import Usuario


class AmistadEstado(models.TextChoices):
    PENDING = "pending", "pending"
    ACCEPTED = "accepted", "accepted"
    BLOCKED = "blocked", "blocked"
    REMOVED = "removed", "removed"


class Amistad(TimeStampedModel):
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="amistades_solicitadas",
    )
    amigo = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="amistades_recibidas",
    )
    estado = models.CharField(max_length=20, choices=AmistadEstado.choices)

    class Meta:
        db_table = "amistades"
        constraints = [
            models.CheckConstraint(
                condition=~models.Q(usuario=models.F("amigo")),
                name="amistad_distintos_usuarios",
            ),
        ]
