from django.db import models
from .usuarios import Usuario
from .recomendaciones import Recomendacion


class CompartidoEstado(models.TextChoices):
    CREADO = "creado", "creado"
    ELIMINADO = "eliminado", "eliminado"


class Compartido(models.Model):
    recomendacion = models.ForeignKey(Recomendacion, on_delete=models.CASCADE)
    emisor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="envios")
    receptor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="recepciones")
    estado = models.CharField(max_length=20, choices=CompartidoEstado.choices, default=CompartidoEstado.CREADO) 

    class Meta:
        db_table = "compartidos"
        # Esto evita que compartan la misma recomendación 2 veces a la misma persona
        unique_together = ('receptor', 'recomendacion') 












