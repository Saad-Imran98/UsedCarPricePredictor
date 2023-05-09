import unittest

from sklearn.preprocessing import OrdinalEncoder

from CarApp.Data.load_data import load_encoded_ordinal_data
from CarApp.models import MlModel, Car


"""
Test class for testing the MLModel class.
"""
class TestMlModel(unittest.TestCase):
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

    @classmethod
    def test_xg_boost(cls):
        model = MlModel(name="xgboost")
        model.model_choice = str(MlModel.ModelChoices.XGBOOST)
        model.train(cls.data)
        for car in cls.cars:
            assert model.predict(car.encode(cls.ordinal_encoder))[0] > 0
        model.save()
        assert MlModel.objects.filter(model_choice=MlModel.ModelChoices.XGBOOST).count() > 0

    @classmethod
    def test_random_forest(cls):
        model = MlModel(name="random_forest", model_choice=MlModel.ModelChoices.RANDOM_FOREST)
        model.train(cls.data)
        for car in cls.cars:
            assert model.predict(car.encode(cls.ordinal_encoder))[0] > 0
        model.save()
        assert MlModel.objects.filter(model_choice=MlModel.ModelChoices.RANDOM_FOREST).count() > 0

    @classmethod
    def test_ridge(cls):
        model_choice = MlModel.ModelChoices.RIDGE_REGRESSION
        model = MlModel(name="random_forest", model_choice=model_choice)
        model.train(cls.data)
        for car in cls.cars:
            assert model.predict(car.encode(cls.ordinal_encoder))[0] > 0
        model.save()
        assert MlModel.objects.filter(model_choice=model_choice).count() > 0

    @classmethod
    def test_linear(cls):
        model_choice = MlModel.ModelChoices.LINEAR_REGRESSION
        model = MlModel(name="random_forest", model_choice=model_choice)
        model.train(cls.data)
        for car in cls.cars:
            assert model.predict(car.encode(cls.ordinal_encoder))[0] > 0
        model.save()
        assert MlModel.objects.filter(model_choice=model_choice).count() > 0

    @classmethod
    def test_elastic_net(cls):
        model_choice = MlModel.ModelChoices.ELASTIC_NET
        model = MlModel(name="random_forest", model_choice=model_choice)
        model.train(cls.data)
        for car in cls.cars:
            assert model.predict(car.encode(cls.ordinal_encoder))[0] > 0
        model.save()
        assert MlModel.objects.filter(model_choice=model_choice).count() > 0
