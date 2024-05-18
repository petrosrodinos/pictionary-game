# Base image
FROM node:18.18.2-alpine as build

WORKDIR /app

#client
COPY client/package*.json ./client/

WORKDIR /app/client

RUN npm install --force

COPY client/ .

RUN npm run build

#api
WORKDIR /app

COPY api/package*.json ./api/

WORKDIR /app/api

RUN npm install

COPY api/ .

RUN npm run build

#copy client dist folder to api
WORKDIR /app
COPY client/dist api/build/dist

WORKDIR /app/api


EXPOSE 5000

CMD ["npm", "start"]

