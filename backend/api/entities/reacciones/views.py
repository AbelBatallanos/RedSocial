from rest_framework.views import APIView
from django.http.response import JsonResponse
from django.utils import timezone
from api.models import Reaccion, Recomendacion
from .serializers import ReaccionSerializer




class ReaccionViewSet(APIView):
    
    def get(self, request):
        user = request.user    
        # Gracias al Manager personalizado, esto ya no trae los eliminados
        reacciones = Reaccion.objects.filter(user=user)
        serializer = ReaccionSerializer(reacciones, many=True)           
        return JsonResponse({"reacciones": serializer.data}, status=200)

    def post(self, request):
        data = request.data
        user = request.user
        
        stars = data.get("stars")
        id_reco = data.get("id_recomendacion")

        if not stars:
            return JsonResponse({"error": "Debes enviar el campo stars"}, status=400)
        if not id_reco:
            return JsonResponse({"error": "Debes enviar el campo id_recomendacion"}, status=400)
        
        try:
            # Buscamos la instancia de recomendación
            reco_instancia = Recomendacion.objects.get(id=id_reco)
            
            # Usamos update_or_create por si existía una eliminada anteriormente 
            # o queremos actualizar la actual.
            reaccion, created = Reaccion.objects.update_or_create(
                user=user,
                recomendacion=reco_instancia,
                defaults={
                    'stars': stars,
                    'puntaje': int(stars) * 20,
                    'estado': 'visto', # valor por defecto
                    'deleted_at': None # Nos aseguramos que esté activa
                }
            )
            
            return JsonResponse({"mensaje": "Reacción registrada"}, status=201)
        except Recomendacion.DoesNotExist:
            return JsonResponse({"error": "La recomendación no existe"}, status=404)


class VerReaccionPorIdRecomendacion(APIView):
    def get(self, request, id_recomendacion):
        # Filtramos por usuario y recomendación (para que un usuario no vea reacciones ajenas si no debe)
        try:
            reaccion = Reaccion.objects.get(
                user=request.user, 
                recomendacion_id=id_recomendacion
            )
            serial = ReaccionSerializer(reaccion)
            return JsonResponse({"reaccion": serial.data}, status=200)
        except Reaccion.DoesNotExist:
            # Retornamos null como pediste
            return JsonResponse({"reaccion": None}, status=200)
        
    def delete(self, request, id_recomendacion):
        try:
            # Buscamos la reacción activa del usuario para esa recomendación
            reaccion = Reaccion.objects.get(
                user=request.user, 
                recomendacion_id=id_recomendacion
            )
            # Aplicamos el borrado lógico
            reaccion.soft_delete()
            return JsonResponse({"mensaje": "Reacción eliminada correctamente"}, status=200)
        except Reaccion.DoesNotExist:
            return JsonResponse({"mensaje": "No existe una reacción activa para eliminar"}, status=404)
        
        