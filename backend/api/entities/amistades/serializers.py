from rest_framework import serializers

from api.models import Amistad, Usuario


class AmistadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Amistad
        fields = "__all__"


class UsuarioMinimoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nombre_usuario', 'avatar', 'has_premium']

class AmistadGetSerializer(serializers.ModelSerializer):
    # Aquí ocurre la magia: 
    # Le decimos que el campo 'usuario' y 'amigo' NO usen el ID,
    # sino que usen el serializador de arriba.
    # usuario = UsuarioMinimoSerializer(read_only=True)
    amigo = UsuarioMinimoSerializer(read_only=True)

    class Meta:
        model = Amistad
        fields = ['id', 'amigo', 'estado']