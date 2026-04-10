from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from api.models import RankingAgregado

from .serializers import RankingAgregadoSerializer


class RankingAgregadoViewSet(viewsets.ModelViewSet):
    queryset = RankingAgregado.objects.all().order_by("-actualizado_en")
    serializer_class = RankingAgregadoSerializer
    permission_classes = [AllowAny]
