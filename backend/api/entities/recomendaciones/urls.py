from django.urls import path
from .views import (
    CrearRecomendacionView,
    VerRecomendacionView,
    VerMisRecomendacionesView,
    VerRecomendacionCompartidaView,
    EditOrDeletRecomendacionView,
    CompartirRecomendacionView,
    ObternerRecomendacionesView
)

urlpatterns = [
    # Crear y listar las propias
    path('crear/', CrearRecomendacionView.as_view(), name='crear_recomendacion'),
    path('mis-recomendaciones/', VerMisRecomendacionesView.as_view(), name='mis_recomendaciones'),
    
    # Editar o Borrar (recibe ID)
    path('<uuid:id_recomendacion>/', EditOrDeletRecomendacionView.as_view(), name='editar_borrar_recomendacion'),
    
    # Perfil público de otro usuario (recibe ID del usuario)
    path('usuario/<uuid:id_usuario>/', VerRecomendacionView.as_view(), name='ver_perfil_usuario'),
    
    # Compartir y ver recibidas
    path('<str:id_recomendacion>/compartir/', CompartirRecomendacionView.as_view(), name='compartir_recomendacion'),
    path('<uuid:id_recomendacion>/recibidas/', VerRecomendacionCompartidaView.as_view(), name='ver_recibidas'),

    path('todos/', ObternerRecomendacionesView.as_view())

]