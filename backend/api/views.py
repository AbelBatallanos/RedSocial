from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import HealthCheckSerializer


class HealthCheckAPIView(APIView):
    def get(self, request):
        payload = {"status": "ok", "service": "django-rest-api"}
        serializer = HealthCheckSerializer(payload)
        return Response(serializer.data)

# from rest_framework.response import Response
# from api.models import Usuario
# from .serializers import UsuarioMinimoSerializer 

# class BuscarUsuarioView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         query = request.GET.get('q', '') # Captura lo que escribes en el buscador
#         if query:
#             # El truco es '__icontains', que busca coincidencias parciales
#             usuarios = Usuario.objects.filter(
#                 Q(nombre_usuario__icontains=query) | Q(correo__icontains=query)
#             ).exclude(id=request.user.id)[:10] # No te muestres a ti mismo
            
#             serializer = UsuarioMinimoSerializer(usuarios, many=True)
#             return Response(serializer.data)
#         return Response([]) # Si no hay texto, devuelve lista vacía