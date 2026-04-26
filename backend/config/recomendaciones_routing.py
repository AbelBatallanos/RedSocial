from django.urls import path

from .recomendaciones_consumers import RecomendacionConsumer

websocket_recomendacion_urlpatterns = [
    path("ws/recomendaciones/public/", RecomendacionConsumer.as_asgi()),
]
