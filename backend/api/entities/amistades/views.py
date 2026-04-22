from django.db.models import Q
from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.http.response import JsonResponse
from rest_framework.views import APIView

from api.models import Amistad, Usuario, Notificacion
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
        usuario = request.user

        if not data.get('amigo_id'):
            return JsonResponse({"error": "El campo amigo_id es obligatorio"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amigo = Usuario.objects.get(id=data['amigo_id'])
        except Usuario.DoesNotExist:
            return JsonResponse({"error": "No existe ese usuario"}, status=status.HTTP_404_NOT_FOUND)

        if str(amigo.id) == str(usuario.id):
            return JsonResponse({"error": "No puedes solicitarte amistad a ti mismo"}, status=status.HTTP_400_BAD_REQUEST)

        # Transacción para evitar condiciones de carrera
        with transaction.atomic():

            existe_misma = Amistad.objects.filter(
                Q(usuario=usuario, amigo=amigo) &
                (Q(estado='pending') | Q(estado='accepted'))
            ).exists()

            existe_inversa = Amistad.objects.filter(
                Q(usuario=amigo, amigo=usuario) &
                (Q(estado='pending') | Q(estado='accepted'))
            ).exists()

            if existe_misma or existe_inversa:
                return JsonResponse({"error": "Ya existe una solicitud o relación con este usuario"}, status=status.HTTP_400_BAD_REQUEST)

            nueva = Amistad.objects.create(usuario=usuario, amigo=amigo, estado='pending')

            Notificacion.objects.create(
                user_destino=amigo,
                tipo='friend_request',
                payload_json={
                    "amistad_id": str(nueva.id),
                    "from_user_id": str(usuario.id),
                    "from_username": usuario.nombre_usuario,
                    "message": f"{usuario.nombre_usuario} te ha enviado una solicitud de amistad"
                },
                leido=False
            )

            serializer = AmistadGetSerializer(nueva, context={'request': request})
            return JsonResponse({"informacion": "Solicitud de amistad enviada","amistad":serializer.data}, status=status.HTTP_201_CREATED)


class ObtenerAmistadesPendientesView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = request.data
        try:
            # 1. Obtener las amistades
            amistades = Amistad.objects.filter(amigo=request.user, estado='pending')
            return JsonResponse({"amistades":AmistadGetSerializer(amistades, many=True).data}, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)  


class ObtenerMisAmigosView(APIView):
    def get(self, request):
        try:
            amistades = Amistad.objects.filter(
                Q(usuario=request.user) | Q(amigo=request.user),
                Q(estado='accepted') | Q(estado='pending')
            ).select_related('usuario', 'amigo').order_by('-creado_en')
            # .select_related('usuario', 'amigo')   evitar consultas N+1.
            serializer = AmistadGetSerializer(amistades, many=True, context={'request': request})
            return JsonResponse({"amistades": serializer.data}, status=status.HTTP_200_OK)       
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)  


class AceptarAmistadView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, amistad_id):
        data = request.data
        try:
            # 1. Validar que la amistad existe
            amistad = Amistad.objects.get(id=amistad_id, amigo=request.user)
            # 2. Aceptar la amistad
            amistad.estado = 'accepted'
            amistad.save()
           
            return JsonResponse({"mensaje": "Amistad aceptada con éxito"}, status=status.HTTP_200_OK)
        except Amistad.DoesNotExist:
            return JsonResponse({"error": "No existe esa solicitud de amistad"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RechazarAmistadView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, amistad_id):
        data = request.data
        try:
            # 1. Validar que la amistad existe
            amistad = Amistad.objects.get(id=amistad_id, amigo=request.user)
            # 2. Rechazar la amistad
            amistad.estado = 'rejected'
            amistad.save()
            return JsonResponse({"mensaje": "Amistad rechazada con éxito"}, status=status.HTTP_200_OK)
        except Amistad.DoesNotExist:
            return JsonResponse({"error": "No existe esa solicitud de amistad"}, status=status.HTTP_404_NOT_FOUND)
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
