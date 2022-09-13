import datetime

from django.db import models

# Create your models here.

class Task(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField()
    date = models.DateTimeField(auto_now=True)


