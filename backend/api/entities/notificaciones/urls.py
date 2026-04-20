from django.urls import path
from .views import NotificacionViewSet, NotificacionListView, NotificacionModView


urlpatterns = [
    path("mine/", NotificacionListView.as_view())
    path("<uuid:id_notif>/", NotificacionModView.as_view())
]

