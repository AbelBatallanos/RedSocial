from rest_framework import serializers
from api.models import Recomendacion, Usuario, Compartido

class UsuarioMinSerializer(serializers.ModelSerializer):
    """Un serializer básico para no exponer datos sensibles del autor"""
    class Meta:
        model = Usuario
        fields = ['id', 'nombre_usuario', 'correo'] # Añade los campos que quieras hacer públicos

class RecomendacionSerializer(serializers.ModelSerializer):
    # Esto es opcional, pero útil si quieres que al devolver la recomendación 
    # te traiga los datos del autor y no solo su ID.
    autor_detalle = UsuarioMinSerializer(source='autor', read_only=True)

    class Meta:
        model = Recomendacion
        fields = [
            'id', 'autor', 'autor_detalle', 'tipo', 'titulo', 
            'descripcion', 'imagen', 'enlace_externo', 'visibilidad', 
            'estado', 'creado_en'
        ]
        read_only_fields = ['id', 'autor', 'estado', 'creado_en']

class CompartidoSerializer(serializers.ModelSerializer):
    recomendacion = RecomendacionSerializer(read_only=True)
    emisor_detalle = UsuarioMinSerializer(source='emisor', read_only=True)

    class Meta:
        model = Compartido
        fields = ['id', 'recomendacion', 'emisor', 'emisor_detalle', 'receptor', 'creado_en']