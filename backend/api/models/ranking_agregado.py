from django.db import models

from .base import TimeStampedModel
from .usuarios import Usuario


class RankingAgregado(TimeStampedModel):
    user = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        related_name="ranking_agregado",
    )
    total_score = models.IntegerField(default=0)
    total_reacciones = models.IntegerField(default=0)
    avg_score_decimal = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    actualizado_en = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        db_table = "ranking_agregado"
        constraints = [
            models.CheckConstraint(
                condition=models.Q(total_score__gte=0),
                name="ranking_total_score_gte_0",
            ),
            models.CheckConstraint(
                condition=models.Q(total_reacciones__gte=0),
                name="ranking_total_reacciones_gte_0",
            ),
        ]
