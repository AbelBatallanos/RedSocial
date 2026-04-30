from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from api.models import Suscripcion


class SuscripcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suscripcion
        # Incluimos los campos que nos interesan
        fields = [
            "id", "user", 
            "estado", "fecha_inicio", "fecha_fin"
        ]
        # El cliente SOLO puede enviar 'user', 'monto', 'metodo_pago' y 'transaccion_id'
        read_only_fields = ["id", "estado", "fecha_inicio", "fecha_fin"]

    def create(self, validated_data):
        fecha_fin = timezone.now() + timedelta(days=30)
        validated_data['fecha_fin'] = fecha_fin
        
        # 2. Crear el registro en la tabla Suscripcion
        suscripcion = super().create(validated_data)
        
        # 3. Actualizar el campo has_premium del Usuario
        usuario = suscripcion.user
        usuario.has_premium = True
        # update_fields optimiza la consulta SQL para actualizar SOLO ese campo
        usuario.save(update_fields=['has_premium']) 
        
        return suscripcion