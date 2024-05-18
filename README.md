#### NODE VERSION: 18.18.2

# CLIENT

## RUN

```sh
cd client
npm install --force
npm run dev
```

# BUILD

```sh
cd client
npm install --force
npm run build
```

# API

## FOR DEVELOPING

```sh
cd api
npm install
npm run dev
```

## FOR PRODUCTION

```sh
cd api
npm install
npm run build
npm start
```

# BUILD DOCKER IMAGE

```sh
cd ./
docker build -t pictionary .
```

# RUN DOCKER IMAGE

```sh
docker run -d -p 5000:5000 -v ./storage:/app/uploads --name pictionary pictionary
```

### notes

By running the api, it also serves the client routes under the same port.
