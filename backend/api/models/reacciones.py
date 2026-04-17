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
    # OPCIONAL: Añadir un comentario por si quieren dejar una opinión escrita
    comentario = models.TextField(blank=True, null=True) 
    estado = models.CharField(max_length=20, choices=ReaccionEstado.choices)
    
    # reaccion_en ya no es necesario porque TimeStampedModel ya tiene creado_en

    # Calculamos el score al vuelo, no lo guardamos en BD
    @property
    def score(self):
        return self.stars * 20

    class Meta:
        db_table = "reacciones"
        constraints = [
            # 1. Validar estrellas del 0 al 5
            models.CheckConstraint(
                condition=models.Q(stars__gte=0) & models.Q(stars__lte=5),
                name="reaccion_stars_0_5",
            ),
            # 2. EVITAR DUPLICADOS: Un usuario solo puede reaccionar 1 vez a la misma recomendación
            models.UniqueConstraint(
                fields=['recomendacion', 'user'],
                name='unica_reaccion_por_usuario'
            )
        ]