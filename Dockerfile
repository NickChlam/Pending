FROM node:10.15.0

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g @angular/cli@6.0.8

COPY . /usr/src/app

COPY . /usr/src/app

CMD ng serve --host 0.0.0.0 --port 4200