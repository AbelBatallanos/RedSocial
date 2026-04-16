from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.http.response import JsonResponse
from rest_framework.views import APIView

from api.models import Amistad, Usuario
from .serializers import AmistadSerializer, AmistadGetSerializer


class AmistadViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            queryset = Amistad.objects.all()
            serializer = AmistadGetSerializer(queryset ,many=True)
            return JsonResponse({"amistades":serializer.data}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SolicitarAmistadView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        try:
            if not request.data.get('amigo_id'):
                return JsonResponse({"error": "El campo amigo_id es obligatorio"}, status=status.HTTP_400_BAD_REQUEST)
            # 1. Validar que el usuario existe
            usuario = Usuario.objects.get(id=request.user.id)
            # 2. Validar que el amigo existe
            amigo = Usuario.objects.get(id=data['amigo_id'])
            # 3. Validar que la amistad no existe
            if Amistad.objects.filter(usuario=usuario, amigo=amigo).exists():
                return JsonResponse({"error": "La amistad ya existe"}, status=status.HTTP_400_BAD_REQUEST)
            if str(amigo.id) == str(request.user.id):
                return JsonResponse({"error": "No puedes solicitarte amistad a ti mismo"}, status=status.HTTP_400_BAD_REQUEST)
            # 4. Crear la amistad
            amistad = Amistad.objects.create(usuario=usuario, amigo=amigo, estado='pending')
            return JsonResponse({"mensaje": "Amistad solicitada con éxito"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ObtenerAmistadesPendientesView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = request.data
        try:
            # 1. Obtener las amistades
            amistades = Amistad.objects.filter(usuario=request.user, estado='pending')
            return JsonResponse({"amistades":AmistadGetSerializer(amistades, many=True).data}, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)  

class ObtenerMisAmigosView(APIView):
    def get(self, request):
        try:
            amistades = Amistad.objects.filter(usuario=request.user)
            return JsonResponse({"amistades":AmistadGetSerializer(amistades, many=True).data}, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)  


class AceptarAmistadView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, amistad_id):
        data = request.data
        try:
            # 1. Validar que la amistad existe
            amistad = Amistad.objects.get(id=amistad_id)
            # 2. Aceptar la amistad
            amistad.estado = 'accepted'
            amistad.save()
            return JsonResponse({"mensaje": "Amistad aceptada con éxito"}, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class RechazarAmistadView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, amistad_id):
        data = request.data
        try:
            # 1. Validar que la amistad existe
            amistad = Amistad.objects.get(id=amistad_id)
            # 2. Rechazar la amistad
            amistad.estado = 'rejected'
            amistad.save()
            return JsonResponse({"mensaje": "Amistad rechazada con éxito"}, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# class EliminarAmistadView(APIView):
#     def delete(self, request, amistad_id):
#         exist = Amistad.objects.filter(amigo=amistad_id).exists()
#         if not exist:
#             return JsonResponse({"error": "No Tiene agregado como amigo"}, status=400)
#         amigo = Amigo.objects.get(amigo=amistad_id)
#         amigo.estado = "removed"
#         amigo.save()

#         return JsonResponse({"mensaje": "Amistad Eliminada con éxito"}, status=200)
