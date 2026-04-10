from rest_framework.routers import DefaultRouter

from .views import AmistadViewSet

router = DefaultRouter()
router.register(r"", AmistadViewSet, basename="amistades")

urlpatterns = router.urls
