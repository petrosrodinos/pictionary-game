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



# FROM nginx
# COPY client/nginx/nginx.conf /etc/nginx/nginx.conf
# COPY --from=build /app/client/dist /usr/share/nginx/html

# EXPOSE 5173

# Set entry point and command