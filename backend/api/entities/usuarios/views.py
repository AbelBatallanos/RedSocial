from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken # <-- Esto genera los tokens
from ...models.usuarios import Usuario # Ajusta la importación según tu estructura
from .serializers import UsuariosSerializer, MiPerfilSerializer

from rest_framework.parsers import MultiPartParser, FormParser



class RegisterView(APIView):
    permission_classes = [AllowAny]
# Indicamos que esta vista acepta datos de formularios con archivos
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request):
        data = request.data

        if not data.get("correo") or not data.get("nombre_usuario") or not data.get("password"):
            return Response(
                {"error": "Faltan campos obligatorios (correo, nombre_usuario, password)"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            foto = request.FILES.get("avatar", None)
            # 1. Creamos el usuario
            user = Usuario.objects.create_user(
                correo=data.get('correo'),
                nombre_usuario=data.get('nombre_usuario'),
                password=data.get('password'),
                fecha_nacimiento=data.get('fecha_nacimiento', None),
                biografia=data.get('biografia', ''),
                avatar = foto
            )

            # 2. GENERAMOS EL TOKEN MANUALMENTE PARA EL NUEVO USUARIO
            refresh = RefreshToken.for_user(user)

            return Response({
                "mensaje": "Usuario creado con éxito",
                "user": {
                    "id": user.id,
                    "correo": user.correo,
                    "nombre_usuario": user.nombre_usuario
                },
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated] # Solo logueados pueden hacer logout

    def post(self, request):
        try:
            # El JWT real no se borra (es stateless), pero podemos "ponerlo en lista negra"
            # para que ya no funcione si intentan usarlo de nuevo.
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"mensaje": "Logout exitoso"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Token inválido"}, status=status.HTTP_400_BAD_REQUEST)


class ListUsuarioView(APIView):
    def get(self, request):
        usuarios = Usuario.objects.all()
        serial = UsuariosSerializer(usuarios, many=True)
        return Response({"Usuarios" :serial.data}, status=200)


class MiPerfil(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # context={"request": request} es vital para que las URLs de las imágenes salgan completas (http://...)
        serializer = MiPerfilSerializer(request.user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = MiPerfilSerializer(
            request.user, 
            data=request.data, 
            partial=True, 
            context={"request": request}
        )
        # se ejecutan las validaciones del serializador (validate_nombre_usuario, etc)
        if serializer.is_valid():
            # Al hacer save(), se llama al método update() que sobreescribimos para borrar la foto vieja
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user = request.user
        user.is_active = False
        user.save()
        return Response({"mensaje": "Cuenta eliminada"}, status=status.HTTP_204_NO_CONTENT)