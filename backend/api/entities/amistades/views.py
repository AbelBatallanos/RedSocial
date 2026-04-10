from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from api.models import Amistad

from .serializers import AmistadSerializer


class AmistadViewSet(viewsets.ModelViewSet):
    queryset = Amistad.objects.all().order_by("-creado_en")
    serializer_class = AmistadSerializer
    permission_classes = [AllowAny]
