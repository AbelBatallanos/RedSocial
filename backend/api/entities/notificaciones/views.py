from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from api.models import Notificacion

from .serializers import NotificacionSerializer


class NotificacionViewSet(viewsets.ModelViewSet):
    queryset = Notificacion.objects.all().order_by("-creado_en")
    serializer_class = NotificacionSerializer
    permission_classes = [AllowAny]
