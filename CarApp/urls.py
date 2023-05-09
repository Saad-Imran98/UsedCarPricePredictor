"""
Contains url registration for routes and urls in the API.
"""
from django.urls import path, include
from rest_framework import routers

import CarApp.views as views

router = routers.DefaultRouter()
router.register(r'cars', views.CarViewSet)
router.register(r'models', views.MlModelViewSet)
router.register(r'predict', views.PredictionViewSet, basename='predict')

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('make-options/', views.data_make_model_options, name="make-options"),
    path('options/', views.data_options, name="options"),
]
