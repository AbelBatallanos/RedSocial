from rest_framework import serializers

from api.models import Reaccion


class ReaccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaccion
        fields = "__all__"
        read_only_fields= ["id"]

    def validate(self, attrs):
        stars = attrs.get("stars")
        score = attrs.get("score")
        if stars is not None and score is not None and score != stars * 20:
            raise serializers.ValidationError(
                {"score": "El score debe ser igual a stars * 20."}
            )
        return attrs
