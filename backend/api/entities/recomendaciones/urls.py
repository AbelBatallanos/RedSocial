from rest_framework.routers import DefaultRouter

from .views import RecomendacionViewSet

router = DefaultRouter()
router.register(r"", RecomendacionViewSet, basename="recomendaciones")

urlpatterns = router.urls
