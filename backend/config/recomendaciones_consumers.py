from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from api.models import Recomendacion
from api.entities.recomendaciones.serializers import RecomendacionSerializer

class RecomendacionConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope.get("user")
        if not user or not user.is_authenticated:
            await self.close(code=4401)
            return

        self.user = user
        #Grupo Público
        self.group_public = "recomendaciones_publicas_feed"
        await self.channel_layer.group_add(self.group_public, self.channel_name)
        await self.accept()
        # Enviamos el primer cargamento de datos al conectar
        await self._send_recomendaciones_snapshot()

    async def disconnect(self, close_code):
        if hasattr(self, "public_group"):
            await self.channel_layer.group_discard(self.public_group, self.channel_name)

    async def receive_json(self, content, **kwargs):
        action = content.get("action")
        if action == "refresh":
            await self._send_recomendacion_snapshot()

    async def recomendaciones_refresh(self, event):
        await self._send_recomendaciones_snapshot()

    async def _send_recomendaciones_snapshot(self):
        recomendaciones = await self._get_user_recomendacion()
        await self.send_json(
            {
                "type": "recomendaciones.snapshot",
                "count": len(recomendaciones),
                "recomendaciones": recomendaciones,
            }
        )

    @database_sync_to_async
    def _get_user_recomendacion(self):
        queryset = Recomendacion.objects.filter(visibilidad="public", estado="creado").order_by("-creado_en")
        serializer = RecomendacionSerializer(queryset, many=True)
        return serializer.data
        # return [
        #     {
        #         "autor": item.autor,
        #         "id_recomendacion": str(item.id),
        #         "tipo": item.tipo,
        #         "titulo": item.titulo,
        #         "descripcion": item.descripcion,
        #         "imagen": item.imagen,
        #         "enlace_externo": item.enlace_externo,
        #         "creado_en": item.creado_en.isoformat() if item.creado_en else None,
        #     }
        #     for item in queryset
        # ]
