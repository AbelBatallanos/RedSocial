from django.db import models
from .usuarios import Usuario
from .base import TimeStampedModel

class MembresiaEstado(models.TextChoices):
    ACTIVA = "activa", "Activa"
    EXPIRADA = "expirada", "Expirada"
    CANCELADA = "cancelada", "Cancelada"

class MetodoPago(models.TextChoices):
    TARJETA = "tarjeta", "Tarjeta de Crédito/Débito"
    PAYPAL = "paypal", "PayPal"
    TRANSFERENCIA = "transferencia", "Transferencia Bancaria"

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
    
    # monto = models.DecimalField(max_digits=10, decimal_places=2)
    # metodo_pago = models.CharField(
    #     max_length=50, 
    #     choices=MetodoPago.choices,
    #     default=MetodoPago.TARJETA
    # )
    # transaccion_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "suscripciones"
        
    def __str__(self):
        return f"Suscripción de {self.user.nombre_usuario} - {self.estado}"