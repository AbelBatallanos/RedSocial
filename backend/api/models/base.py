import uuid

from django.db import models


class TimeStampedModel(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        db_column="id",
    )
    creado_en = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        abstract = True
