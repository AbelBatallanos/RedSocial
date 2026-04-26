from django.urls import path

from .consumers import AppWebSocketConsumer
from .notifications_routing import websocket_notificaciones_urlpatterns
from .recomendaciones_routing import websocket_recomendacion_urlpatterns

websocket_urlpatterns = [
    path("ws/socket/", AppWebSocketConsumer.as_asgi()),
]

websocket_urlpatterns += websocket_notificaciones_urlpatterns
websocket_urlpatterns += websocket_recomendacion_urlpatterns
