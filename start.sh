#!/bin/bash

echo "Activate environment"
source venv/bin/activate

echo "Running server"
python manage.py runserver 0.0.0.0:8000
