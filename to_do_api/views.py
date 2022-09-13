from rest_framework import viewsets

from .models import *
from .serializers import TaskSerial


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-date')
    serializer_class = TaskSerial
