FROM node:lts AS frontend
WORKDIR /react_app
COPY /Frontend/package.json /react_app
RUN npm install
COPY Frontend .
RUN npm run build

FROM python:3.8.8
COPY --from=frontend /react_app/static/frontend /fyp/Frontend/static/frontend
COPY . /fyp/
WORKDIR /fyp
RUN chmod +x ./setup.sh
RUN ./setup.sh
