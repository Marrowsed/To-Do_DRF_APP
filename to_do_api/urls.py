from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path, include
from to_do_api import views

router = DefaultRouter()
router.register(r'task', views.TaskViewSet,basename="task")

urlpatterns = [
    path('', include(router.urls))
]