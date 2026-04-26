from channels.generic.websocket import AsyncJsonWebsocketConsumer


class AppWebSocketConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send_json(
            {
                "message": "WebSocket conectado correctamente.  Implementado....",
                "path": self.scope.get("path"),
                
            }
        )

    async def receive_json(self, content, **kwargs):
        await self.send_json(
            {
                "type": "echo",
                "data": content,
                "prueba-socket": "aprovado --", 

            }
        )
