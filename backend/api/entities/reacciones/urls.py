from rest_framework.routers import path

from .views import ReaccionViewSet, VerReaccionPorIdRecomendacion

urlpatterns = [
    path("reaccion/", ReaccionViewSet.as_view()),
    path("recomendacion/<uuid:id_recomendacion>/", VerReaccionPorIdRecomendacion.as_view())
]



