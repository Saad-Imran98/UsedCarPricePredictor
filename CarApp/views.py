"""
Contains all views for API responses.
"""

from rest_framework import status
from rest_framework import viewsets, mixins
from rest_framework.decorators import api_view
from rest_framework.response import Response

from CarApp.apps import CarappConfig
from CarApp.models import Car, MlModel
from CarApp.serializers import CarSerializer, MlModelSerializer, PredictionSerializer


# Create your views here.

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all().order_by('model')
    serializer_class = CarSerializer


class MlModelViewSet(viewsets.ModelViewSet):
    queryset = MlModel.objects.all().order_by('name')
    serializer_class = MlModelSerializer


class PredictionViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = PredictionSerializer

    def closest_mileage_in_range(self, mileage):
        mileages = CarappConfig.dataframe.mileage.unique()
        if mileage not in mileages:
            closest = min(mileages, key=lambda x: abs(x - mileage))
            return closest
        return mileage

    def create(self, request):
        algorithm = request.data["algorithm"]
        user_selected_model = MlModel.objects.filter(model_choice=algorithm)
        if user_selected_model.count() == 0:
            response_msg = "Bad algorithm '" + algorithm + "'" + ". Allowed list includes: " + str(
                list(MlModel.ModelChoices.values))
            return Response(response_msg, status=status.HTTP_400_BAD_REQUEST)
        model = user_selected_model.order_by('created').first()
        car_id = request.data["car"]
        car = Car.objects.filter(id=car_id).first()
        car_encoded = car.encode(CarappConfig.ordinal_encoder)
        prediction = model.predict(car_encoded)[0]
        return Response({"predicted_price": prediction}, status=status.HTTP_200_OK)


@api_view(['GET'])
def data_make_model_options(request):
    make = request.query_params['make']
    unique_options = sorted(list(CarappConfig.dataframe.loc[CarappConfig.dataframe.make == make].model.unique()))
    return Response({"options": unique_options})


@api_view(['GET'])
def data_year_options(request):
    unique_options = CarappConfig.dataframe.year.unique()
    return Response({"options": unique_options})


@api_view(['GET'])
def data_options(request):
    response = {}
    for col in CarappConfig.dataframe.columns:
        response[col] = sorted(list(CarappConfig.dataframe[col].unique()))
    return Response(response)
