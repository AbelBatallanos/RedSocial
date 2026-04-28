from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import SuscripcionSerializer



class ActivarSuscripcionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        usuario = request.user
        
        # Evitar que un usuario que ya es premium pague de nuevo
        if getattr(usuario, 'has_premium', False):
            return Response(
                {"error": "Tu cuenta ya es Premium."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        data = request.data.copy()
        data['user'] = usuario.id 

        serializer = SuscripcionSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            
            return Response(
                {"mensage": "Suscripción activada con éxito!.."}, 
                status=status.HTTP_201_CREATED
            )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)