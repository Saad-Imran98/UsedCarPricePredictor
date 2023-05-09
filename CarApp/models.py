import pickle
from enum import Enum

from django.db import models
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import ElasticNet
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from xgboost import XGBRegressor


"""
Enum for selecting hypertuned model object instances.
"""
class ModelSelection(Enum):
    XGBOOST = XGBRegressor(n_estimators=400, booster='gbtree')
    RANDOM_FOREST = RandomForestRegressor(min_samples_leaf=0.001, n_estimators=250)
    LINEAR_REGRESSION = LinearRegression()
    RIDGE_REGRESSION = Ridge(alpha=100)
    K_NEAREST_NEIGHBOR = KNeighborsClassifier(n_neighbors=1)
    ELASTIC_NET = ElasticNet(alpha=0.05, l1_ratio=0.7, max_iter=1000)

"""
Make model foreign key object to use with Car.
"""
class Make(models.Model):
    make = models.CharField(max_length=60)

"""
Car Model with car features and encoding in numpy array to be used for predictions.
"""
class Car(models.Model):
    make = models.CharField(max_length=60)
    make_fk = models.ForeignKey(on_delete=models.CASCADE, to=Make, null=True)
    model = models.CharField(max_length=60)
    year = models.IntegerField(auto_created=True)
    price = models.DecimalField(max_digits=100, decimal_places=2, null=True)
    transmission = models.CharField(max_length=60)
    mileage = models.IntegerField(auto_created=True)
    fuelType = models.CharField(max_length=60)
    engineSize = models.DecimalField(max_digits=100, decimal_places=2)

    def as_array(self):
        model = self.model
        if model[0] != ' ':
            model = ' ' + model
        return [[model, self.year, self.transmission, self.mileage, self.fuelType, self.engineSize.real, self.make]]

    def encode(self, encoder):
        as_array = self.as_array()
        encoding = encoder.transform(as_array)
        return encoding

"""
MLModel class for training, saving, loading supported ML algorithms. 
"""
class MlModel(models.Model):
    class ModelChoices(models.TextChoices):
        XGBOOST = "XGBOOST"
        RANDOM_FOREST = "RANDOM_FOREST"
        LINEAR_REGRESSION = "LINEAR_REGRESSION"
        RIDGE_REGRESSION = "RIDGE_REGRESSION"
        K_NEAREST_NEIGHBOR = "K_NEAREST_NEIGHBOR"
        ELASTIC_NET = "ELASTIC_NET"

    name = models.CharField(max_length=128)
    description = models.CharField(max_length=1000)
    model = models.BinaryField(max_length=None)
    created = models.DateTimeField(auto_now_add=True, blank=True)
    model_choice = models.CharField(
        max_length=100,
        choices=ModelChoices.choices,
        default=ModelChoices.XGBOOST
    )

    def train(self, data):
        X = data['data']
        y = data['target']
        X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=1001)
        model = ModelSelection[self.model_choice].value
        model.fit(X_train, y_train)
        self.model = pickle.dumps(model)
        self.trained = True

    def predict(self, sample):
        model = pickle.loads(self.model)
        return model.predict(sample)

"""
Prediction class wrapper for ML model prediction results for a car.
"""
class Prediction(models.Model):
    algorithm = models.CharField(max_length=60)
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    predicted_price = models.DecimalField(max_digits=100, decimal_places=2, null=True)
