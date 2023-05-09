#!/bin/bash

echo "Installing pip requirements"
pip install -r requirements.txt

echo "Make migrations"
python manage.py makemigrations CarApp
