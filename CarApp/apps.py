from django.apps import AppConfig
from django.db.models.signals import post_migrate
from sklearn.preprocessing import OrdinalEncoder

from CarApp.Data.load_data import load_encoded_ordinal_data, load_used_car_data_as_dataframe


def post_migration_callback(sender, **kwargs):
    try:
        from CarApp.models import MlModel
        for algorithm in MlModel.ModelChoices.values:
            if MlModel.objects.filter(model_choice=algorithm).count() == 0:
                print("Training ", algorithm)
                model = MlModel(name=algorithm, model_choice=MlModel.ModelChoices[algorithm].value)
                model.train(sender.data)
                model.save()
            else:
                print("Using cached ", algorithm)
    except Exception as e:
        print("Exception while loading default ML algorithms", str(e))

"""
CarApp configuration is set here. Ready function runs on startup to train ML Models.
"""
class CarappConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "CarApp"
    dataframe = load_used_car_data_as_dataframe()
    ordinal_encoder = OrdinalEncoder(categories='auto')
    data, encoder = load_encoded_ordinal_data(ordinal_encoder)
    ordinal_encoder = encoder

    def ready(self):
        post_migrate.connect(post_migration_callback, sender=self)
