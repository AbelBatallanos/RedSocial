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
            "password_hash",
            "fecha_nacimiento",
            "biografia",
            "avatar",
            "estado",
            "creado_en",
        ]
        read_only_fields = ["unique_id", "creado_en", "password_hash"]

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
            password_hash=make_password(password),
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

        if not check_password(password, usuario.password_hash):
            raise serializers.ValidationError("Credenciales inválidas.")
        if usuario.estado != "active":
            raise serializers.ValidationError("Usuario inactivo.")
        attrs["usuario"] = usuario
        return attrs
