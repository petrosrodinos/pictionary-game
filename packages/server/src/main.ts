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
    if (rooms[code]) {
      //&& rooms[code].players.length !== rooms[code].maxPlayers
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
          setTimeout(() => {
            room.currentArtist = room.players[1];
            room.status = "selecting-word";
            socket.emit("choosing-word-time-finished", room);
            socket.in(code).emit("choosing-word-time-finished", room);
          }, room.choosingWordTime);
        }
      }
      socket.join(code);
      socket.in(code).emit("user-joined", room);
      socket.emit("user-joined", room);
      socket.on("start-game", (code: string) => {
        room.status = "selecting-word";
        room.currentArtist = room.players[0];
        socket.in(code).emit("game-started", room);
        socket.emit("game-started", room);
        setTimeout(() => {
          room.currentArtist = room.players[1];
          room.status = "selecting-word";
          socket.emit("choosing-word-time-finished", room);
          socket.in(code).emit("choosing-word-time-finished", room);
        }, room.choosingWordTime);
      });
      // socket.on("disconnect", () => {
      //   room.players = room.players.filter((u) => u.userId !== user.userId);
      //   socket.in(code).emit("user-left", room);
      //   socket.emit("user-left", room);
      // });
    }
  });
  socket.on("join-room", async (code: string, userId: string) => {
    let room = rooms[code];
    if (!room) {
      //|| !rooms[code].players.find((u) => u.userId === userId)
      return;
    }
    console.log("join-room", code);
    socket.join(code);
    socket.emit("send-info", room);
    socket.on("send-changes", (data: any) => {
      socket.broadcast.to(code).emit("receive-changes", data);
      room.drawings.push(data);
    });
    socket.on("word-selected", (code: string, word: string) => {
      room.word = word;
      room.status = "playing";
      socket.emit("word-changed", room);
      socket.in(code).emit("word-changed", room);
      setTimeout(() => {
        room.round++;
        room.word = "";
        if (room.round > room.players.length) {
          room.status = "finished";
          socket.emit("game-finished", room);
          socket.in(code).emit("game-finished", room);
        } else {
          room.status = "selecting-word";
          room.currentArtist = room.players[room.round - 1];
          socket.emit("round-finished", room);
          socket.in(code).emit("round-finished", room);
          setTimeout(() => {
            room.currentArtist = room.players[room.round];
            room.status = "selecting-word";
            socket.emit("choosing-word-time-finished", room);
            socket.in(code).emit("choosing-word-time-finished", room);
          }, room.choosingWordTime);
        }
      }, room.roundTime);
    });
  });
});
