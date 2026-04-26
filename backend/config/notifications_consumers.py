from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from api.models import Notificacion


class NotificacionesConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope.get("user")
        if not user or not user.is_authenticated:
            await self.close(code=4401)
            return

        self.user = user
        self.group_name = f"notificaciones_{str(user.id).replace('-', '')}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self._send_notifications_snapshot()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        action = content.get("action")
        if action == "refresh":
            await self._send_notifications_snapshot()

    async def notifications_refresh(self, event):
        await self._send_notifications_snapshot()

    async def _send_notifications_snapshot(self):
        notifications = await self._get_user_notifications()
        await self.send_json(
            {
                "type": "notifications.snapshot",
                "count": len(notifications),
                "notifications": notifications,
            }
        )

    @database_sync_to_async
    def _get_user_notifications(self):
        queryset = Notificacion.objects.filter(user_destino=self.user).order_by("-creado_en")
        return [
            {
                "id_notificacion": str(item.id),
                "tipo": item.tipo,
                "payload_json": item.payload_json,
                "leido": item.leido,
                "creado_en": item.creado_en.isoformat() if item.creado_en else None,
            }
            for item in queryset
        ]
