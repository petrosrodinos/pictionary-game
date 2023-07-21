import express, { Application, NextFunction, Request, Response } from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./router";
import cors from "cors";
import { createContext } from "./lib/trpc";
import { ConnectedUser, Room } from "./interfaces/room";
const io = require("socket.io");

const app: Application = express();
const http = require("http").Server(app);

app.use(cors());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello world!" });
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
  })
);

const PORT: number = Number(process.env.PORT) || 3000;
http.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});

const socket = io(http, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

socket.on("connection", (socket: any) => {
  let rooms: { [code: string]: Room } = {};
  socket.on("join-room", async (code: string) => {
    console.log("join-room", code);
    socket.join(code);
    socket.on("send-changes", (delta: any) => {
      socket.broadcast.to(code).emit("receive-changes", delta);
    });
  });
  socket.on("create-room", async (settings: Room) => {
    rooms[settings.code] = {
      ...settings,
      users: [],
      drawings: [],
      gameStarted: false,
    };
  });
  socket.on("join-waiting-room", async (code: string, user: ConnectedUser) => {
    if (rooms[code]) {
      console.log("join-waiting-room", code);
      const room = rooms[code];
      room.users.push(user);
      socket.join(code);
      socket.emit("user-joined", room);
      // socket.broadcast.to(code).emit("user-joined", room);
    }
  });
});
