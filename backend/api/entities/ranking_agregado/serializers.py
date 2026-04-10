from decimal import Decimal, ROUND_HALF_UP

from rest_framework import serializers

from api.models import RankingAgregado


class RankingAgregadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RankingAgregado
        fields = "__all__"

    def _compute_avg(self, attrs):
        total_score = attrs.get("total_score")
        total_reacciones = attrs.get("total_reacciones")
        if total_reacciones and total_reacciones > 0:
            value = Decimal(total_score) / Decimal(total_reacciones)
            return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        return None

    def create(self, validated_data):
        validated_data["avg_score_decimal"] = self._compute_avg(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        total_score = validated_data.get("total_score", instance.total_score)
        total_reacciones = validated_data.get(
            "total_reacciones", instance.total_reacciones
        )
        validated_data["avg_score_decimal"] = self._compute_avg(
            {"total_score": total_score, "total_reacciones": total_reacciones}
        )
        return super().update(instance, validated_data)
