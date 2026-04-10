from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from api.models import Reaccion

from .serializers import ReaccionSerializer


class ReaccionViewSet(viewsets.ModelViewSet):
    queryset = Reaccion.objects.all().order_by("-reaccion_en")
    serializer_class = ReaccionSerializer
    permission_classes = [AllowAny]
