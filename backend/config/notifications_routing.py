from django.urls import path

from .notifications_consumers import NotificacionesConsumer

websocket_notificaciones_urlpatterns = [
    path("ws/notificaciones/", NotificacionesConsumer.as_asgi()),
]
