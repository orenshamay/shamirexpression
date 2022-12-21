FROM node:latest

RUN mkdir -p /usr/src/app

RUN apt-get update && apt-get install -y ffmpeg

RUN apt-get -y install redis-server

WORKDIR /usr/src/app

COPY . .

RUN npm i

EXPOSE 5000

CMD nohup redis-server & npm run prod