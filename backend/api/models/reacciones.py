from django.db import models

from .base import TimeStampedModel
from .recomendaciones import Recomendacion
from .usuarios import Usuario


class ReaccionEstado(models.TextChoices):
    VISTO = "visto", "visto"
    ACEPTADO = "aceptado", "aceptado"
    RECHAZADO = "rechazado", "rechazado"


class Reaccion(TimeStampedModel):
    recomendacion = models.ForeignKey(
        Recomendacion,
        on_delete=models.CASCADE,
        related_name="reacciones",
    )
    user = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="reacciones",
    )
    stars = models.SmallIntegerField()
    score = models.SmallIntegerField()
    estado = models.CharField(max_length=20, choices=ReaccionEstado.choices)
    reaccion_en = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "reacciones"
        constraints = [
            models.CheckConstraint(
                condition=models.Q(stars__gte=0) & models.Q(stars__lte=5),
                name="reaccion_stars_0_5",
            ),
            models.CheckConstraint(
                condition=models.Q(score__gte=0) & models.Q(score__lte=100),
                name="reaccion_score_0_100",
            ),
            models.CheckConstraint(
                condition=models.Q(score=models.F("stars") * 20),
                name="reaccion_score_equals_stars_x20",
            ),
        ]
