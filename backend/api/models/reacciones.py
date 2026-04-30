from django.db import models
from django.utils import timezone
from .base import TimeStampedModel
from .recomendaciones import Recomendacion
from .usuarios import Usuario

# Manager para filtrar automáticamente los eliminados
class ReaccionActiveManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)

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
    puntaje = models.IntegerField()
    estado = models.CharField(max_length=20, choices=ReaccionEstado.choices)
    
    # Campo para Soft Delete
    deleted_at = models.DateTimeField(null=True, blank=True)

    # Managers
    objects = ReaccionActiveManager() # Por defecto solo trae los activos
    all_objects = models.Manager()    # Para cuando necesites ver TODO (incluyendo eliminados)

    @property
    def score(self):
        return self.stars * 20

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.save()

    class Meta:
        db_table = "reacciones"
        constraints = [
            models.CheckConstraint(
                condition=models.Q(stars__gte=0) & models.Q(stars__lte=5),
                name="reaccion_stars_0_5",
            ),
            # IMPORTANTE: El UniqueConstraint ahora solo aplica si NO está eliminado
            models.UniqueConstraint(
                fields=['recomendacion', 'user'],
                condition=models.Q(deleted_at__isnull=True),
                name='unica_reaccion_activa_por_usuario'
            )
        ]