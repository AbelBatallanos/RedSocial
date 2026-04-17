from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import transaction

from api.models import Recomendacion, Usuario, Notificacion, Compartido
from .serializers import RecomendacionSerializer, CompartidoSerializer, UsuarioMinSerializer

class CrearRecomendacionView(APIView):
    def post(self, request):
        user = request.user
        
        # 1. Validar límite para usuarios no premium
        # Asegúrate de que has_premium exista en tu modelo Usuario o ajústalo a es_premium
        if not getattr(user, 'has_premium', False): 
            countRecomendaciones = Recomendacion.objects.filter(autor=user, estado="creado").count()
            if countRecomendaciones >= 5:
                return Response(
                    {"error": "Ha excedido la cantidad máxima (5). Mejora a Premium."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        
        # 2. Usar el Serializer para validar y guardar datos (incluyendo la imagen)
        # request.data automáticamente maneja archivos (imágenes) si la petición es multipart/form-data
        serializer = RecomendacionSerializer(data=request.data)
        
        if serializer.is_valid():
            # Pasamos el autor explícitamente al guardar
            serializer.save(autor=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerRecomendacionView(APIView): 
    """Muestra el perfil público de un usuario y sus recomendaciones"""
    def get(self, request, id_usuario):
        # get_object_or_404 es más limpio que hacer el try/except manual
        usuario = get_object_or_404(Usuario, id=id_usuario)
        
        recomendaciones = Recomendacion.objects.filter(
            autor=usuario, 
            visibilidad="public",
            estado="creado" # No mostrar las eliminadas (Soft Delete)
        ).order_by("-creado_en")
        
        # Serializamos los datos
        user_data = UsuarioMinSerializer(usuario).data
        recomendaciones_data = RecomendacionSerializer(recomendaciones, many=True).data
        
        # Estructura limpia donde el autor sale 1 vez
        return Response({
            "autor": user_data,
            "recomendaciones": recomendaciones_data
        }, status=status.HTTP_200_OK)


class VerMisRecomendacionesView(APIView):
    """Muestra todas las recomendaciones (públicas y privadas) del usuario logueado"""
    def get(self, request):
        recomendaciones = Recomendacion.objects.filter(
            autor=request.user,
            estado="creado"
        ).order_by("-creado_en")
        
        serializer = RecomendacionSerializer(recomendaciones, many=True)
        return Response({"recomendaciones": serializer.data}, status=status.HTTP_200_OK)


class VerRecomendacionCompartidaView(APIView): 
    """Muestra el historial de recomendaciones que me han compartido"""
    def get(self, request, id_recomendacion):
        # Buscamos en la tabla Compartido donde yo soy el receptor
        compartido = Compartido.objects.filter(
            id=id_recomendacion,
            receptor=request.user,
            estado="creado" # Solo si la recomendación no ha sido eliminada por su autor
        ).order_by("-creado_en")

        serializer = CompartidoSerializer(compartidos, many=False)
        return Response({'recibidas': serializer.data}, status=status.HTTP_200_OK)


class EditOrDeletRecomendacionView(APIView):
    def put(self, request, id_recomendacion):
        recomendacion = get_object_or_404(Recomendacion, id=id_recomendacion, estado="creado")

        if request.user != recomendacion.autor:
            return Response({"error": "No eres el autor de esta publicación"}, status=status.HTTP_403_FORBIDDEN)

        serializer = RecomendacionSerializer(recomendacion, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"mensaje": "Actualizado con éxito", "data": serializer.data}, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id_recomendacion):
        recomendacion = get_object_or_404(Recomendacion, id=id_recomendacion, estado="creado")

        if request.user != recomendacion.autor:
            return Response({"error": "No eres el autor de esta publicación"}, status=status.HTTP_403_FORBIDDEN)
        
        # Soft Delete: Solo cambiamos el estado, no la borramos de la DB
        recomendacion.estado = "eliminado"
        recomendacion.save()

        return Response({"mensaje": "Eliminado con éxito"}, status=status.HTTP_200_OK)


class CompartirRecomendacionView(APIView):
    def post(self, request, id_recomendacion):
        amigos_ids = request.data.get('amigos_ids', [])
        
        if not amigos_ids:
            return Response({"error": "Debes proveer una lista de amigos_ids"}, status=status.HTTP_400_BAD_REQUEST)
            
        recomendacion = get_object_or_404(Recomendacion, id=id_recomendacion, estado="creado")
        
        # Usamos transaction.atomic para asegurar que si falla Notificacion, tampoco se guarde el Compartido
        try:
            with transaction.atomic():
                compartidos = []
                notificaciones = []
                
                # Para evitar problemas con IDs que no existen, podrías validar los amigos_ids aquí
                usuarios_amigos = Usuario.objects.filter(id__in=amigos_ids)
                
                for amigo in usuarios_amigos:
                    # 1. Crear el registro en el historial Compartido
                    compartidos.append(Compartido(
                        recomendacion=recomendacion,
                        emisor=request.user,
                        receptor=amigo
                    ))
                    
                    # 2. Crear la Notificación
                    notificaciones.append(Notificacion(
                        user_destino=amigo,
                        tipo="compartido",
                        payload_json={
                            "emisor_nombre": request.user.nombre_usuario,
                            "recomendacion_titulo": recomendacion.titulo,
                            "recomendacion_id": recomendacion.id,
                            "mensaje": request.data.get('mensaje_opcional', '')
                        }
                    ))
                
                # bulk_create ejecuta todo rápido
                Compartido.objects.bulk_create(compartidos)
                Notificacion.objects.bulk_create(notificaciones)
                
            return Response({"mensaje": f"Compartido con éxito a {len(usuarios_amigos)} amigos"}, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)