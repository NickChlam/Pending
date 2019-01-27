FROM node:10.15.0

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g @angular/cli@6.0.8

EXPOSE 4200 49153

CMD ng serve --host 0.0.0.0 --port 4200 --poll 1