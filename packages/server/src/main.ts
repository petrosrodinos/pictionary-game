import express, { Application, NextFunction, Request, Response } from "express";
import { ConnectedUser, Room } from "./interfaces/room";
import cors from "cors";
const usersRoutes = require("./routes/users");
const bodyParser = require("body-parser");
const io = require("socket.io");

const app: Application = express();
const http = require("http").Server(app);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

app.use("/api/auth", usersRoutes);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello world!" });
});

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

let rooms: { [code: string]: Room } = {};
socket.on("connection", (socket: any) => {
  socket.on("join-room", async (code: string) => {
    console.log("join-room", code);
    socket.join(code);
    socket.on("send-changes", (delta: any) => {
      socket.broadcast.to(code).emit("receive-changes", delta);
    });
  });
  socket.on("get-info", async (code: string) => {
    socket.emit("send-info", rooms[code]);
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
      const room = rooms[code];
      if (!room.users.find((u) => u.userId === user.userId)) {
        console.log("join-waiting-room", code);
        room.users.push(user);
        if (room.users.length === room.players) {
          room.gameStarted = true;
          socket.in(code).emit("game-started", room);
          socket.emit("game-started", room);
        }
      }
      socket.join(code);
      // socket.broadcast.to(code).emit("user-joined", room);
      socket.in(code).emit("user-joined", room);
      socket.emit("user-joined", room);
    }
  });
});
