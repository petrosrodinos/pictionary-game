# INSTALLATION

```sh
from root:npm install
```

# client

```sh
from root: npm run start-client
```

# server

### first time

```sh
cd packages/server
npx prisma generate
npx prisma db push
npm run dev
```

### other times

`from root: npm run dev`
