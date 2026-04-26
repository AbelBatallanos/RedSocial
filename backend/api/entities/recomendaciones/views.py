import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import transaction, IntegrityError
from api.models import Recomendacion, Usuario, Notificacion, Compartido, Amistad
from .serializers import RecomendacionSerializer, CompartidoSerializer, CompartidoConOtroSerializer, UsuarioMinSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from api.signals import _notify_user_notifications_changed


class CrearRecomendacionView(APIView):

    parser_classes = (MultiPartParser, FormParser)
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
            data = serializer.validated_data
            data.setdefault("visibilidad", "public") #asignamos valores por defect si no hay datos 
            data.setdefault("tipo", "otro")
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
        
        compartidasConmigo = Compartido.objects.filter(receptor=request.user, estado="creado")
        compartiConOtros = Compartido.objects.filter(emisor=request.user, estado="creado")
        serializer = RecomendacionSerializer(recomendaciones, many=True)
        serial_compartidOtros = CompartidoConOtroSerializer(compartiConOtros, many=True)
        serial_compartidconmigo = CompartidoSerializer(compartidasConmigo, many=True)

        return Response({"total_recomendaciones":recomendaciones.count(),"recomendaciones": serializer.data,
        "compartidosconmigo": serial_compartidconmigo.data, "comparticonotros": serial_compartidOtros.data}, status=status.HTTP_200_OK)


class VerRecomendacionCompartidaView(APIView): 
    """Muestra el historial de recomendaciones que me han compartido"""
    def get(self, request, id_recomendacion):
        # 1. Validar que la recomendación existe
        recomendacion = get_object_or_404(Recomendacion, id=id_recomendacion, estado="creado")

        # 2. Intentar obtener un único Compartido
        try:
            compartido = Compartido.objects.get(
                recomendacion=recomendacion,
                receptor=request.user,   # usar la instancia, no .id
                estado="creado"
            )
            serlizer = CompartidoSerializer(compartido, many=False)
            return Response({'recibidas': serlizer.data}, status=status.HTTP_200_OK)
        except Compartido.DoesNotExist:
            return Response(
                {"error": "No existe un registro de compartido para este usuario y recomendación"},
                status=status.HTTP_404_NOT_FOUND
            )


# class VerTodasRecomendacionesCompartidas
class EditOrDeletRecomendacionView(APIView):
    
    parser_classes = (MultiPartParser, FormParser)
    def put(self, request, id_recomendacion):
        
        try:
          validated_recomend= uuid.UUID(str(id_recomendacion))
          recomendacion = Recomendacion.objects.get(id=validated_recomend, estado="creado")
        except Recomendacion.DoesNotExist:
            return Response({"error": "no existe la recomendacion dada"}, status=404)
        except Exception:
          return Response({"error": " no es un UUID válido"}, status=status.HTTP_400_BAD_REQUEST)
    
        if request.user != recomendacion.autor:
            return Response({"error": "No tienes permisos para modificar este registro"}, status=status.HTTP_403_FORBIDDEN)

        serializer = RecomendacionSerializer(recomendacion, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"mensaje": "Actualizado con éxito", "data": serializer.data}, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id_recomendacion):
        recomendacion = get_object_or_404(Recomendacion, id=id_recomendacion, estado="creado")

        if request.user != recomendacion.autor:
            return Response({"error": "No eres el autor de esta publicación"}, status=status.HTTP_403_FORBIDDEN)
        
        # Soft Delete: Solo cambiamos el estado, no la borramos de la DB
        recomendacion.estado = "eliminado"
        recomendacion.save(update_fields=['estado'])

        return Response({"mensaje": "Eliminado con éxito"}, status=status.HTTP_200_OK)


class ObternerRecomendacionesView(APIView):
    def get(self, request):
        
        recomendaciones = Recomendacion.objects.filter(visibilidad="public")
        serial = RecomendacionSerializer(recomendaciones, many=True)
        return Response(serial.data, status=200)


class CompartirRecomendacionView(APIView):
     def post(self, request, id_recomendacion):
        amigos_ids = request.data.get('amigos_ids', [])

        try:
            id_recomendacion_uuid = uuid.UUID(str(id_recomendacion))
        except Exception:
            return Response({"error": "id_recomendacion no es un UUID válido"}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(amigos_ids, list) or not amigos_ids:
            return Response({"error": "Debes proveer una lista de amigos con este atributo: 'amigos_ids'':''['idUsuario','idUsuario'.....]' "}, status=400)

        recomendacion = Recomendacion.objects.get( id=id_recomendacion_uuid, estado="creado")
        if not recomendacion:
            return Response({"error": "no existe la recomendacion dada"}, status=404)
        
        # validar UUIDs
        valid_uuids = []
        invalid = []
        for raw in amigos_ids:
            try:
                valid_uuids.append(uuid.UUID(str(raw)))
            except Exception:
                invalid.append(raw)
        if invalid:
            return Response({"error": "IDs inválidos", "invalid": invalid}, status=400)

        usuarios = Usuario.objects.filter(id__in=valid_uuids )
        if not usuarios.exists():
            return Response({"mensaje": "No se encontraron amigos con esos IDs"}, status=404)

        mis_amigos = []
        noson_amigo = []
        for user in usuarios:
            es_amigo = Amistad.objects.filter(estado="accepted").filter( Q(usuario=request.user, amigo=user) |
                Q(amigo=request.user, usuario=user)).exists() 
            if es_amigo:
                mis_amigos.append(user)
            else:
                noson_amigo.append(user.id)
        
        if noson_amigo:
            return Response({
                "error": "Algunos IDs no son válidos para compartir",
                "message": "Solo puedes compartir con amigos"
            }, status=status.HTTP_400_BAD_REQUEST)

        to_create_compartidos = []
        to_create_notifs = []
        
        for user in usuarios:
            to_create_compartidos.append(Compartido(
                    recomendacion=recomendacion,  # instancia OK
                    emisor=request.user,
                    receptor=user
                ))
            to_create_notifs.append(Notificacion(
                user_destino=user,
                tipo="compartido",
                payload_json={
                    "emisor_nombre": request.user.nombre_usuario,
                    "recomendacion_titulo": recomendacion.titulo,
                    "recomendacion_id": str(recomendacion.id),
                }
            ))

           
        try:
            with transaction.atomic():
                created_comp = Compartido.objects.bulk_create(to_create_compartidos) if to_create_compartidos else []
                Notificacion.objects.bulk_create(to_create_notifs) if to_create_notifs else []
            
            
                receptores_ids = {n.user_destino_id for n in to_create_notifs} 

                def _broadcast(): #mandamos datos al ws sobre los cambios surgidos en la tabla
                    for uid in receptores_ids:
                        _notify_user_notifications_changed(uid)

            # Disparamos el broadcast SOLAMENTE si la base de datos guardó todo exitosamente
            transaction.on_commit(_broadcast)
            
            return Response({
                "mensaje": f"Compartido con éxito a {len(created_comp)} amigos",
                "omitidos_por_existencia": len(usuarios) - len(created_comp)
            }, status=201)
        except IntegrityError as e:
            return Response({"error": "Error de integridad: " + str(e)}, status=500)
        except Exception as e:
            return Response({"error": str(e)}, status=500)