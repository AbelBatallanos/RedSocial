from django.urls import path

from .consumers import AppWebSocketConsumer

websocket_urlpatterns = [
    path("ws/socket/", AppWebSocketConsumer.as_asgi()),
]
