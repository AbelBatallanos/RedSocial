from django.urls import path
from .views import SolicitarAmistadView, ObtenerAmistadesPendientesView, ObtenerMisAmigosView, AceptarAmistadView, RechazarAmistadView

urlpatterns = [
    path('solicitar-amistad/', SolicitarAmistadView.as_view(), name='solicitar-amistad'),
    path('obtener-amistades/', ObtenerMisAmigosView.as_view(), name='obtener-amistades'),
    path('obtener-amistades-pendientes/', ObtenerAmistadesPendientesView.as_view(), name='obtener-amistades-pendientes'),
    path('aceptar-amistad/<uuid:amistad_id>/', AceptarAmistadView.as_view(), name='aceptar-amistad'),
    path('rechazar-amistad/<uuid:amistad_id>/', RechazarAmistadView.as_view(), name='rechazar-amistad'),
]