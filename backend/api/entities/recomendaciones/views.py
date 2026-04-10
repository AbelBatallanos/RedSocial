from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from api.models import Recomendacion

from .serializers import RecomendacionSerializer


class RecomendacionViewSet(viewsets.ModelViewSet):
    queryset = Recomendacion.objects.all().order_by("-creado_en")
    serializer_class = RecomendacionSerializer
    permission_classes = [AllowAny]
