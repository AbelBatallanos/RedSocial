from rest_framework.routers import path

from .views import ActivarSuscripcionView

urlpatterns = [
    path("crear/", ActivarSuscripcionView.as_view()),
]



