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
let choosingWordTimer: any;
socket.on("connection", (socket: any) => {
  //creating room
  socket.on("create-room", async (settings: Room) => {
    rooms[settings.code] = {
      ...settings,
      players: [],
      drawings: [],
      status: "created",
      round: 1,
    };
  });
  //join waiting room
  socket.on("join-waiting-room", async (code: string, user: ConnectedUser) => {
    let room = rooms[code];
    if (room) {
      //&& rooms[code].players.length !== rooms[code].maxPlayers
      //checks if user is already in room
      if (!room.players.find((u) => u.userId === user.userId)) {
        console.log("join-waiting-room", code);
        room.players.push({
          ...user,
          points: 0,
        });
      }
      if (room.status == "waiting-room" || room.status == "created") {
        room.status = "waiting-room";
      }
      socket.join(code);
      socket.in(code).emit("user-joined", room);
      socket.emit("user-joined", room);
      //checks if all players are in room and starts game
      if (room.status == "waiting-room" && room.players.length === room.maxPlayers) {
        room.currentArtist = room.players[0];
        socket.in(code).emit("game-started", room);
        socket.emit("game-started", room);
        room.status = "starting";
        //starts timer for choosing word and emit event when time is up
        startChoosingWord(room, socket, code);
      }

      //when creator presses start game
      socket.on("start-game", (code: string) => {
        room.currentArtist = room.players[0];
        room.status = "selecting-word";
        socket.in(code).emit("game-started", room);
        socket.emit("game-started", room);
        //starts timer for choosing word and emit event when time is up
        startChoosingWord(room, socket, code);
      });
      // socket.on("disconnect", () => {
      //   room.players = room.players.filter((u) => u.userId !== user.userId);
      //   socket.in(code).emit("user-left", room);
      //   socket.emit("user-left", room);
      // });
    }
  });
  //join playing room
  socket.on("join-room", async (code: string, userId: string) => {
    let room = rooms[code];
    if (!room) {
      //|| !rooms[code].players.find((u) => u.userId === userId)
      return;
    }
    console.log("join-room", code);
    socket.join(code);
    socket.emit("send-info", room);
    //when artist drawing transmits data to other players
    socket.on("send-changes", (data: any) => {
      socket.broadcast.to(code).emit("receive-changes", data);
      room.drawings.push(data);
    });
    //when artist selects word
    socket.on("word-selected", (code: string, word: string) => {
      clearTimeout(choosingWordTimer);
      const room = rooms[code];
      room.word = word;
      room.status = "playing";
      socket.emit("word-changed", room);
      socket.in(code).emit("word-changed", room);
      //starts timer for round and emit event when time is up
      setTimeout(() => {
        room.word = "";
        room.status = "selecting-word";
        room.round++;
        room.currentArtist = room.players[room.round - 1];
        socket.emit("round-finished", room);
        socket.in(code).emit("round-finished", room);
        startChoosingWordOnGame(room, socket, code);
      }, room.roundTime);
    });
    //when artist leaves choosing word screen
    socket.on("leave-choosing-word", (code: string) => {
      // room.players = room.players.filter((u) => u.userId !== userId);
      room.status = "selecting-word";
      room.currentArtist = room.players[room.round];
      socket.in(code).emit("artist-left", room);
      socket.emit("artist-left", room);
    });
  });
});

function startChoosingWordOnGame(room: Room, socket: any, code: string) {
  //starts timer for choosing word and emit event when time is up
  choosingWordTimer = setTimeout(() => {
    room.round++;
    if (room.round > room.players.length) {
      room.status = "finished";
      socket.emit("game-finished", room);
      socket.in(code).emit("game-finished", room);
    } else {
      // if the player didn't choose a word, pass the turn to the next player
      room.currentArtist = room.players[room.round - 1];
      socket.emit("choosing-word-time-finished", room);
      socket.in(code).emit("choosing-word-time-finished", room);
      startChoosingWord(room, socket, code);
    }
  }, room.choosingWordTime);
}

function startChoosingWord(room: Room, socket: any, code: string) {
  room.status = "selecting-word";
  if (room.round > 1) {
    // room.round++;
    // room.currentArtist = room.players[room.round - 1];
    socket.emit("round-finished", room);
    socket.in(code).emit("round-finished", room);
  }
  //starts timer for choosing word and emit event when time is up
  choosingWordTimer = setTimeout(() => {
    room.round++;
    if (room.round > room.players.length) {
      room.status = "finished";
      socket.emit("game-finished", room);
      socket.in(code).emit("game-finished", room);
    } else {
      // if the player didn't choose a word, pass the turn to the next player
      room.currentArtist = room.players[room.round - 1];
      socket.emit("choosing-word-time-finished", room);
      socket.in(code).emit("choosing-word-time-finished", room);
      startChoosingWord(room, socket, code);
    }
  }, room.choosingWordTime);
}
