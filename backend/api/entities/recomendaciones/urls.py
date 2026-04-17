from django.urls import path
from .views import (
    CrearRecomendacionView,
    VerRecomendacionView,
    VerMisRecomendacionesView,
    VerRecomendacionCompartidaView,
    EditOrDeletRecomendacionView,
    CompartirRecomendacionView
)

urlpatterns = [
    # Crear y listar las propias
    path('recomendaciones/crear/', CrearRecomendacionView.as_view(), name='crear_recomendacion'),
    path('recomendaciones/mis-recomendaciones/', VerMisRecomendacionesView.as_view(), name='mis_recomendaciones'),
    
    # Editar o Borrar (recibe ID)
    path('recomendaciones/<uuid:id_recomendacion>/', EditOrDeletRecomendacionView.as_view(), name='editar_borrar_recomendacion'),
    
    # Perfil público de otro usuario (recibe ID del usuario)
    path('recomendaciones/usuario/<uuid:id_usuario>/', VerRecomendacionView.as_view(), name='ver_perfil_usuario'),
    
    # Compartir y ver recibidas
    path('recomendaciones/<uuid:id_recomendacion>/compartir/', CompartirRecomendacionView.as_view(), name='compartir_recomendacion'),
    path('recomendaciones/recibidas/', VerRecomendacionCompartidaView.as_view(), name='ver_recibidas'),
]