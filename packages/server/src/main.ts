import express, { Application, NextFunction, Request, Response } from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./router";
import cors from "cors";
import { createContext } from "./lib/trpc";
import { Room } from "./interfaces/room";
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
  socket.on("join-room", async (documentId: string) => {
    console.log("join-room", documentId);
    socket.join(documentId);
    socket.on("send-changes", (delta: any) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });
  });
  socket.on("create-room", async (settings: Room) => {
    rooms[settings.code] = {
      ...settings,
      users: [],
      drawings: [],
    };
    console.log("create-room", rooms);
  });
  socket.on("join-room", async (code: string, user: any) => {
    if (rooms[code]) {
      rooms[code].users.push(user);
      console.log("join-room", rooms[code]);
      socket.join(code);
      socket.broadcast.to(code).emit("user-joined", user);
    }
  });
});
