# INSTALLATION

# client

```sh
cd client
npm install --legacy-peer-devs
npm run dev
```

# server

### first time

```sh
cd server
npx prisma generate
npx prisma db push
npm run dev
```

### other times

```sh
cd server
npm run dev
```
