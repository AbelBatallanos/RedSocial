from django.db import models

from .base import TimeStampedModel
from .usuarios import Usuario


class RecomendacionTipo(models.TextChoices):
    PELICULA = "pelicula", "pelicula"
    LIBRO = "libro", "libro"
    LUGAR = "lugar", "lugar"
    SERIE = "serie", "serie"
    OTRO = "otro", "otro"


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
    metadata_json = models.JSONField(null=True, blank=True)
    visibilidad = models.CharField(
        max_length=20,
        choices=RecomendacionVisibilidad.choices,
    )

    class Meta:
        db_table = "recomendaciones"
