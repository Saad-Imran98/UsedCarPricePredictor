#!/bin/bash

echo "(1/7) Setup frontend"
cd Frontend

echo "(2/7) Install frontend dependencies"
npm install

echo "(3/7) Run frontend build"
npm run build

cd ../

echo "(4/7) Making virtual python environment"
virtualenv venv

echo "(5/7) Activate environment"
source venv/bin/activate

echo "(6/7) setup backend"
./setup.sh

echo "(7/7) Apply migrations to database"
python manage.py migrate

