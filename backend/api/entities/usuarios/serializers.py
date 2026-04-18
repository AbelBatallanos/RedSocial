import os
from django.contrib.auth.hashers import check_password, make_password
from rest_framework import serializers
from api.models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=6)

    class Meta:
        model = Usuario
        fields = [
            "unique_id",
            "nombre_usuario",
            "correo",
            "password",
            "password",
            "fecha_nacimiento",
            "biografia",
            "avatar",
            "estado",
            "creado_en",
        ]
        read_only_fields = ["unique_id", "creado_en", "password"]

    def create(self, validated_data):
        raw_password = validated_data.pop("password", None)
        if not raw_password:
            raise serializers.ValidationError({"password": "Este campo es obligatorio."})
        validated_data["password_hash"] = make_password(raw_password)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        raw_password = validated_data.pop("password", None)
        if raw_password:
            validated_data["password_hash"] = make_password(raw_password)
        return super().update(instance, validated_data)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = Usuario
        fields = ["unique_id", "nombre_usuario", "correo", "password", "creado_en"]
        read_only_fields = ["unique_id", "creado_en"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        usuario = Usuario.objects.create(
            password=make_password(password),
            estado="active",
            **validated_data,
        )
        return usuario


class LoginSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        correo = attrs.get("correo")
        password = attrs.get("password")
        try:
            usuario = Usuario.objects.get(correo=correo)
        except Usuario.DoesNotExist as exc:
            raise serializers.ValidationError("Credenciales inválidas.") from exc

        if not check_password(password, usuario.password):
            raise serializers.ValidationError("Credenciales inválidas.")
        if usuario.estado != "active":
            raise serializers.ValidationError("Usuario inactivo.")
        attrs["usuario"] = usuario
        return attrs


class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nombre_usuario', 'correo', 'avatar', 'biografia', 'fecha_nacimiento', 'estado'] 
    

class MiPerfilSerializer(serializers.ModelSerializer):
    # Forzamos a que estos campos no sean obligatorios al actualizar
    biografia = serializers.CharField(required=False, allow_blank=True, max_length=500)
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Usuario
        fields = ['nombre_usuario', 'correo', 'avatar', 'biografia', 'fecha_nacimiento', 'estado']
        read_only_fields =['id', 'correo']  # por ejemplo, si no quieres permitir cambiar el correo

    def validate_nombre_usuario(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("El nombre de usuario debe tener al menos 3 caracteres.")
        return value

    def update(self, instance, validated_data):
        if "avatar" in validated_data:
            nuevaFoto = validated_data["avatar"]

            # Si el usuario ya tenía una foto, y la nueva es diferente (o es None porque la borró)
            if instance.avatar and instance.avatar != nuevaFoto:        # Continuamos con el guardado normal
                # Verificamos que el archivo físico exista antes de intentar borrarlo
                if os.path.isfile(instance.avatar.path):
                    os.remove(instance.avatar.path)

        return super().update(instance, validated_data)

    