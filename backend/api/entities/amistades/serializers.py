from rest_framework import serializers

from api.models import Amistad


class AmistadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Amistad
        fields = "__all__"
