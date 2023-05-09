"""
Registers admin settings here.
"""

from django.contrib import admin

from CarApp.models import Car

# Register your models here.
admin.site.register(Car)
