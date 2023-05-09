"""
Load data.py - a file for functions that load data into the app.
"""

import pandas as pd
import os

from sklearn.compose import ColumnTransformer

file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '.'))


def load_used_car_data_as_dataframe():
    master_dataset_path = file_path + "/master_dataset.csv"
    data = pd.read_csv(master_dataset_path, index_col=0)
    return data


def load_audi_encoded_ordinal_data(ordinal_encoder, sample_size=0):
    master_dataset_path = file_path + "/audi.csv"
    data = pd.read_csv(master_dataset_path, index_col=0)
    if sample_size != 0:
        data = data.head(sample_size)
    X = data.drop(columns=['price'])
    y = data['price'].to_numpy()
    X = ordinal_encoder.fit_transform(X)
    ordinal_data = {'data': X, 'target': y}
    return ordinal_data, ordinal_encoder


def load_encoded_ordinal_data(ordinal_encoder, sample_size=0):
    master_dataset_path = file_path + "/master_dataset.csv"
    data = pd.read_csv(master_dataset_path)

    if sample_size != 0:
        data = data.head(sample_size)

    X = data.drop(columns=['price', 'Unnamed: 0', 'index']).to_numpy()
    y = data['price'].to_numpy()

    ct = ColumnTransformer(
        [('ordinal_encoder', ordinal_encoder, [0, 2, 4, 6])],
        # The column numbers to be transformed (here is [0] but can be [0, 1, 3])
        remainder='passthrough'  # Leave the rest of the columns untouched
    )

    X_t = ct.fit_transform(X)

    ordinal_data = {'data': X_t, 'target': y}

    return ordinal_data, ct


def load_data(sample_size=0):
    data = load_used_car_data_as_dataframe()
    if sample_size != 0:
        data = data.sample(frac=(sample_size / len(data)))
    X = data.drop(columns=['price'])
    columns = X.columns
    y = data['price'].to_numpy()
    X = X.to_numpy()

    return {'data': X, 'target': y, 'features': list(columns)}
