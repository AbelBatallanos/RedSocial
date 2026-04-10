from rest_framework import serializers

from api.models import Recomendacion


class RecomendacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recomendacion
        fields = "__all__"
