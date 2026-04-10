from rest_framework.routers import DefaultRouter

from .views import ReaccionViewSet

router = DefaultRouter()
router.register(r"", ReaccionViewSet, basename="reacciones")

urlpatterns = router.urls
