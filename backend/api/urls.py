from django.urls import include, path

from api.views import HealthCheckAPIView

urlpatterns = [
    path('health/', HealthCheckAPIView.as_view(), name='health-check'),
    path("usuarios/", include("api.entities.usuarios.urls")),
    path("amistades/", include("api.entities.amistades.urls")),
    path("notificaciones/", include("api.entities.notificaciones.urls")),
    path("ranking-agregado/", include("api.entities.ranking_agregado.urls")),
    path("recomendaciones/", include("api.entities.recomendaciones.urls")),
    path("reacciones/", include("api.entities.reacciones.urls")),
]
