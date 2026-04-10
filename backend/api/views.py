from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import HealthCheckSerializer


class HealthCheckAPIView(APIView):
    def get(self, request):
        payload = {"status": "ok", "service": "django-rest-api"}
        serializer = HealthCheckSerializer(payload)
        return Response(serializer.data)
