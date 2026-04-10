from rest_framework.routers import DefaultRouter

from .views import RankingAgregadoViewSet

router = DefaultRouter()
router.register(r"", RankingAgregadoViewSet, basename="ranking-agregado")

urlpatterns = router.urls
