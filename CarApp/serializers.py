# serializers.py
from rest_framework import serializers

from CarApp.models import Car, MlModel, Prediction

"""
Serializer for Car object.
"""
class CarSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Car
        fields = ('url', 'make', 'model', 'make', 'model', 'year', 'transmission', 'mileage', 'fuelType', 'engineSize')

"""
Serializer for ML Model object.
"""
class MlModelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MlModel
        fields = ('name', 'description', 'created')

"""
Serializer for Prediction object.
"""
class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = ('algorithm', 'car', 'predicted_price')
