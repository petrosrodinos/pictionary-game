import express, { Application, NextFunction, Request, Response } from "express";
import { ConnectedUser, Room } from "./interfaces/room";
import cors from "cors";
import { ROUND_TIME } from "./constants/game";
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
  socket.on("create-room", async (settings: Room) => {
    rooms[settings.code] = {
      ...settings,
      players: [],
      drawings: [],
      status: "created",
      round: 1,
    };
  });
  socket.on("join-waiting-room", async (code: string, user: ConnectedUser) => {
    if (rooms[code] && rooms[code].players.length !== rooms[code].maxPlayers) {
      const room = rooms[code];
      if (!room.players.find((u) => u.userId === user.userId)) {
        console.log("join-waiting-room", code);
        room.players.push({
          ...user,
          points: 0,
        });
        room.status = "waiting-room";
        if (room.players.length === room.maxPlayers) {
          room.status = "selecting-word";
          room.currentArtist = room.players[0];
          socket.in(code).emit("game-started", room);
          socket.emit("game-started", room);
        }
      }
      socket.join(code);
      socket.in(code).emit("user-joined", room);
      socket.emit("user-joined", room);
    }
  });
  socket.on("join-room", async (code: string, userId: string) => {
    if (!rooms[code] || !rooms[code].players.find((u) => u.userId === userId)) {
      return;
    }
    console.log("join-room", code);
    socket.join(code);
    socket.emit("send-info", rooms[code]);
    socket.on("send-changes", (delta: any) => {
      socket.broadcast.to(code).emit("receive-changes", delta);
    });
    socket.on("word-selected", (code: string, word: string) => {
      rooms[code].word = word;
      rooms[code].status = "playing";
      socket.emit("word-changed", rooms[code]);
      socket.in(code).emit("word-changed", rooms[code]);
      setTimeout(() => {
        rooms[code].round++;
        rooms[code].word = "";
        if (rooms[code].round > rooms[code].players.length) {
          rooms[code].status = "finished";
          socket.emit("game-finished", rooms[code]);
          socket.in(code).emit("game-finished", rooms[code]);
        } else {
          rooms[code].status = "selecting-word";
          rooms[code].currentArtist = rooms[code].players[rooms[code].round - 1];
          socket.emit("time-finished", rooms[code]);
          socket.in(code).emit("time-finished", rooms[code]);
        }
      }, ROUND_TIME * 1000 * 100000);
    });
  });
});
