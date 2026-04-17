from .usuarios import Usuario
from django.db import models
from .base import TimeStampedModel

class MembresiaEstado(models.TextChoices):
    ACTIVA = "activa", "activa"
    EXPIRADA = "expirada", "expirada"
    CANCELADA = "cancelada", "cancelada"

class Suscripcion(TimeStampedModel):
    user = models.ForeignKey(
        Usuario, 
        on_delete=models.CASCADE, 
        related_name="suscripciones"
    )
    estado = models.CharField(
        max_length=20, 
        choices=MembresiaEstado.choices, 
        default=MembresiaEstado.ACTIVA
    )
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    fecha_fin = models.DateTimeField()
    
    # Útil para cuando integres Stripe o PayPal en el futuro
    transaccion_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "suscripciones"
        
    def __str__(self):
        return f"Suscripción de {self.user.nombre_usuario} - {self.estado}"