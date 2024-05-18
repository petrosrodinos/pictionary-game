# Base image
FROM node:18

WORKDIR /app

COPY api/ .

RUN npm install

RUN npm run build

COPY client/dist ./build/dist

EXPOSE 5000

CMD ["npm", "start"]

