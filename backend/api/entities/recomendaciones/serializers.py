from rest_framework import serializers
from api.models import Recomendacion, RecomendacionTipo, RecomendacionVisibilidad, Usuario, Compartido

class UsuarioMinSerializer(serializers.ModelSerializer):
    """Un serializer básico para no exponer datos sensibles del autor"""
    class Meta:
        model = Usuario
        fields = ['id', 'nombre_usuario', 'correo'] # Añade los campos que quieras hacer públicos

class RecomendacionSerializer(serializers.ModelSerializer):
    # Esto es opcional, pero útil si quieres que al devolver la recomendación 
    # te traiga los datos del autor y no solo su ID.
    autor_detalle = UsuarioMinSerializer(source='autor', read_only=True)
    
    titulo = serializers.CharField(
        error_messages={
            'required': 'El título es obligatorio.',
            'blank': 'El título no puede estar vacío.',
            'invalid': 'El título debe ser texto.'
        }
    )
    tipo = serializers.ChoiceField(
        choices=RecomendacionTipo.choices,
        required=False,
        error_messages={
            
            'invalid_choice': 'Tipo inválido. Debe ser: pelicula, libro, lugar, serie, otro'
        }
    )

    descripcion = serializers.CharField(
        required=False,
        allow_blank=True,
        error_messages={
            'invalid': 'La descripción debe ser texto.'
        },
        style={'base_template': 'textarea.html'}
    )
    visibilidad = serializers.CharField(required=False)

    class Meta:
        model = Recomendacion
        fields = [
            'id', 'autor_detalle', 'tipo', 'titulo', 
            'descripcion', 'imagen', 'enlace_externo', 'visibilidad', 'creado_en',
            
        ]
        read_only_fields = ['id', 'autor', 'estado', 'creado_en']

    def validate_visibilidad(self, value):
        allowed = [choice[0] for choice in RecomendacionVisibilidad.choices]
        if value not in allowed:
            raise serializers.ValidationError('Visibilidad inválida. Debe ser: ' + ', '.join(allowed))
        return value
    
    def validate_tipo(self, value):
        allowed = [choice[0] for choice in RecomendacionTipo.choices]
        if value not in allowed:
            raise serializers.ValidationError('Tipo inválido. Debe ser: ' + ', '.join(allowed))
        return value

class CompartidoSerializer(serializers.ModelSerializer):
    recomendacion = RecomendacionSerializer(read_only=True)
    emisor = UsuarioMinSerializer( read_only=True)

    class Meta:
        model = Compartido
        fields = [ 'recomendacion', 'emisor']


class CompartidoConOtroSerializer(serializers.ModelSerializer):
    recomendacion = RecomendacionSerializer(read_only=True)
    receptor = UsuarioMinSerializer(source='emisor', read_only=True)

    class Meta:
        model= Compartido
        fields=  [ 'recomendacion', 'receptor']