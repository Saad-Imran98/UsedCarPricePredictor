import unittest

from django.test import Client
from rest_framework import status
from sklearn.preprocessing import OrdinalEncoder

from CarApp.Data.load_data import load_encoded_ordinal_data
from CarApp.models import MlModel, Car

"""
Test class for testing the Prediction class and functionality.
"""
class TestPredictions(unittest.TestCase):
    ordinal_encoder = OrdinalEncoder()
    data = None
    model = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.data, encoder = load_encoded_ordinal_data(cls.ordinal_encoder)
        cls.ordinal_encoder = encoder
        cls.model = MlModel()
        cls.model.train(cls.data)
        cls.cars = [
            Car(make='audi', model=' A1', year=2017,
                price=0, transmission='Automatic', mileage=36000,
                fuelType='Diesel', engineSize=3.0),
            Car(make='audi', model=' A1', year=2012,
                price=0, transmission='Automatic', mileage=106000,
                fuelType='Diesel', engineSize=3.0)
        ]
        cls.cars_dict = [
            {
                "make": 'audi',
                "model": ' A1',
                "year": 2017,
                "transmission": 'Automatic',
                "mileage": 36000,
                "fuelType": 'Diesel',
                "engineSize": 3.0
            },
            {
                "make": 'audi',
                "model": ' A1',
                "year": 2012,
                "transmission": 'Automatic',
                "mileage": 106000,
                "fuelType": 'Diesel',
                "engineSize": 3.0
            }
        ]
        cls.client = Client()

    @classmethod
    def test_predict(cls):
        assert cls.model.trained
        for car in cls.cars:
            encoded_car = car.encode(cls.ordinal_encoder)
            prediction = cls.model.predict(encoded_car)
            assert prediction > 0

    @classmethod
    def test_post_details(cls):
        for algorithm in MlModel.ModelChoices.values:
            for car in cls.cars:
                car.save()
                request = {
                    "car": car.id,
                    "algorithm": algorithm
                }
                response = cls.client.post('http://127.0.0.1:8000/api/predict/',
                                           request,
                                           content_type='application/json')
                assert response.status_code == status.HTTP_200_OK
                assert response.data['predicted_price'] > 0
