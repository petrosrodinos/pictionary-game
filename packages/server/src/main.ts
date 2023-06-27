// const app = require("express")();
import express, { Application, NextFunction, Request, Response } from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./router";
import cors from "cors";
import { createContext } from "./lib/trpc";
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
  console.log(`🚀 Server running on Port: ${PORT}`);
});

const socket = io(http, {
  cors: {
    origin: process.env.IO_ORIGIN,
    methods: ["GET", "POST"],
  },
});

socket.on("connection", (socket: any) => {
  socket.on("get-document", async (documentId: string) => {
    console.log("get-document", documentId);
    socket.join(documentId);
    socket.on("send-changes", (delta: any) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });
  });
});
