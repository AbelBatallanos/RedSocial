from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Usuario

from .serializers import LoginSerializer, RegisterSerializer, UsuarioSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by("-creado_en")
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()
        return Response(
            {
                "message": "Registro exitoso.",
                "user_id": str(usuario.unique_id),
                "nombre_usuario": usuario.nombre_usuario,
                "correo": usuario.correo,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.validated_data["usuario"]
        request.session["usuario_id"] = str(usuario.unique_id)
        request.session["usuario_correo"] = usuario.correo
        return Response(
            {
                "message": "Login exitoso.",
                "user_id": str(usuario.unique_id),
                "nombre_usuario": usuario.nombre_usuario,
            },
            status=status.HTTP_200_OK,
        )


class LogoutAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        request.session.flush()
        return Response({"message": "Logout exitoso."}, status=status.HTTP_200_OK)
