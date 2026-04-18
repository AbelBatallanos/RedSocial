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
    # usuario = UsuarioMinimoSerializer(read_only=True)

    usuario = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Amistad
        fields = ['id', 'usuario', 'estado']

    def get_usuario(self, obj):
        request_user = self.context.get('request').user if self.context.get('request') else None
        # si no hay request en el contexto, devolvemos el amigo por defecto
        otro_usuario = obj.amigo if obj.usuario == request_user else obj.usuario
        return UsuarioMinimoSerializer(otro_usuario, context=self.context).data