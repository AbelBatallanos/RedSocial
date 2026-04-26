from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django.http.response import JsonResponse
from api.models import Notificacion
from .serializers import NotificacionSerializer
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView




class NotificacionViewSet(viewsets.ModelViewSet):
    queryset = Notificacion.objects.all().order_by("-creado_en")
    serializer_class = NotificacionSerializer
    permission_classes = [AllowAny]


class NotificacionListView(APIView):

    def get(self, request):
        notif = Notificacion.objects.filter(user_destino=request.user, leido=False).order_by("-creado_en")
        serial = NotificacionSerializer(notif, many=True)
        return JsonResponse({"notificaciones": serial.data}, status=200)
    
    
class NotificacionModView(APIView):
    
    def put(self, request, id_notificacion):
        notificacion = get_object_or_404(
            Notificacion,
            unique_id=id_notificacion,
            user_destino=request.user,
            leido=False,
        )
        notificacion.leido = True
        notificacion.save(update_fields=["leido"])
        return JsonResponse({"mensaje": "marcado como leido" }, status=204)
