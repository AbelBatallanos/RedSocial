from django.db import models

from .base import TimeStampedModel
from .usuarios import Usuario


class RecomendacionTipo(models.TextChoices):
    PELICULA = "pelicula", "pelicula"
    LIBRO = "libro", "libro"
    LUGAR = "lugar", "lugar"
    SERIE = "serie", "serie"
    OTRO = "otro", "otro"

class RecomendacionEstado(models.TextChoices):
    CREADO = "creado", "creado"
    ELIMINADO = "eliminado", "eliminado"


class RecomendacionVisibilidad(models.TextChoices):
    PRIVATE = "private", "private"
    PUBLIC = "public", "public"


class Recomendacion(TimeStampedModel):
    autor = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="recomendaciones",
    )
    tipo = models.CharField(max_length=20, choices=RecomendacionTipo.choices)
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True) 
    imagen = models.ImageField(upload_to='recomendaciones/imagenes/', blank=True, null=True)
    enlace_externo = models.URLField(max_length=500, blank=True, null=True)

    visibilidad = models.CharField(
        max_length=20,
        choices=RecomendacionVisibilidad.choices,
    )
    estado = models.CharField(max_length=20, choices=RecomendacionEstado.choices, default=RecomendacionEstado.CREADO) 

    class Meta:
        db_table = "recomendaciones"
