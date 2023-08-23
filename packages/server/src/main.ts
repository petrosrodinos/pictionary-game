import express, { Application, NextFunction, Request, Response } from "express";
import { ConnectedUser, Room, Statuses } from "./interfaces/room";
import cors from "cors";
const usersRoutes = require("./routes/users");
const bodyParser = require("body-parser");
const io = require("socket.io");

const app: Application = express();
const http = require("http").Server(app);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

app.use("/api", usersRoutes);

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
let roundTimer: any;
socket.on("connection", (socket: any) => {
  //creating room
  socket.on("create-room", async (settings: Room) => {
    rooms[settings.code] = {
      ...settings,
      players: [],
      drawings: [],
      status: Statuses.CREATED,
      round: 1,
      message: "",
      lastWord: "",
    };
  });
  //join waiting room
  socket.on("join-waiting-room", async (code: string, user: ConnectedUser) => {
    let room = rooms[code];
    if (room) {
      //&& rooms[code].players.length !== rooms[code].maxPlayers
      //checks if user is already in room
      socket.join(code);
      if (room.status == Statuses.WAITING_ROOM || room.status == Statuses.CREATED) {
        room.status = Statuses.WAITING_ROOM;
      }
      const playerToJoin = room.players.find((u) => u.userId === user.userId);
      if (!playerToJoin && room.players.length < room.maxPlayers) {
        console.log("join-waiting-room", code);
        room.players.push({
          ...user,
          points: 0,
          connected: true,
        });
        socket.in(code).emit("user-joined", room);
        socket.emit("user-joined", room);
      } else if (playerToJoin && !playerToJoin?.connected) {
        room.players = room.players.map((u) => {
          if (u.userId === user.userId) {
            u.connected = true;
          }
          return u;
        });
        socket.emit("user-joined", room);
        socket.in(code).emit("user-joined", room);
      }
      //checks if all players are in room and starts game
      if (room.status == Statuses.WAITING_ROOM && room.players.length === room.maxPlayers) {
        room.currentArtist = room.players[0];
        socket.in(code).emit("game-started", room);
        socket.emit("game-started", room);
        //starts timer for choosing word and emit event when time is up
        startChoosingWord(room, socket, code);
      }

      //when creator presses start game
      socket.on("start-game", (code: string) => {
        room.currentArtist = room.players[0];
        socket.in(code).emit("game-started", room);
        socket.emit("game-started", room);
        //starts timer for choosing word and emit event when time is up
        startChoosingWord(room, socket, code);
      });
      socket.on("disconnect", () => {
        if (room.status == Statuses.WAITING_ROOM && room.players.length === 1) {
          delete rooms[code];
        } else if (room.status == Statuses.WAITING_ROOM) {
          console.log("disconnect", code);
          // room.players = room.players.filter((u) => u.userId !== user.userId);
          room.players = room.players.map((u) => {
            if (u.userId === user.userId) {
              u.connected = false;
            }
            return u;
          });
          socket.in(code).emit("user-left", room);
          socket.emit("user-left", room);
        }
      });
    }
  });
  //join playing room
  socket.on("join-room", async (code: string, user: ConnectedUser) => {
    let room = rooms[code];
    if (!room || room.players.length > room.maxPlayers) return;
    if (!room.players.find((u) => u.userId === user.userId)) {
      room.players.push({
        ...user,
        points: 0,
      });
    }
    console.log("join-room", code);
    socket.join(code);
    socket.emit("send-info", room);
    // socket.in(code).emit("send-info", room);
    //when artist drawing transmits data to other players
    socket.on("send-changes", (data: any) => {
      if (data == null) {
        room.drawings = [];
      }
      socket.broadcast.to(code).emit("receive-changes", data);
      if (data) {
        room.drawings.push(data);
      }
    });
    //when artist selects word
    socket.on("word-selected", (code: string, word: string) => {
      clearTimeout(choosingWordTimer);
      const room = rooms[code];
      room.word = word;
      room.drawings = [];
      room.status = Statuses.PLAYING;
      socket.emit("word-changed", room);
      socket.in(code).emit("word-changed", room);
      //starts timer for round and emit event when time is up
      roundTimer = setTimeout(() => {
        room.lastWord = room.word;
        room.word = "";
        room.status = Statuses.SELECTING_WORD;
        let nextRound = room.round + 1;
        if (nextRound > room.players.length) {
          room.status = Statuses.FINISHED;
          socket.emit("game-finished", room);
          socket.in(code).emit("game-finished", room);
          delete rooms[code];
          return;
        }
        room.round++;
        room.currentArtist = findNextArtist(room.players, room.round);
        socket.emit("round-finished", room);
        socket.in(code).emit("round-finished", room);
        startChoosingWordInGame(room, socket, code);
      }, room.roundTime);
    });
    socket.on("disconnect", () => {
      room.players = room.players.map((u) => {
        if (u.userId === user.userId) {
          u.connected = false;
        }
        return u;
      });

      console.log("disconnect", room.players.length);
      if (
        findDisconnectedUsersLength(room.players) === 1 &&
        room.maxPlayers > 2 &&
        room.status !== Statuses.FINISHED
      ) {
        clearTimeout(roundTimer);
        clearTimeout(choosingWordTimer);
        room.message = "Looks like game is finished";
        room.status = Statuses.FINISHED;
        socket.in(code).emit("all-users-left", room);
        delete rooms[code];
        return;
      }
      if (
        room.currentArtist &&
        room.currentArtist.userId === user.userId &&
        room.status !== Statuses.FINISHED
      ) {
        room.word = "";
        room.round++;
        room.currentArtist = findNextArtist(room.players, room.round);
        room.status = Statuses.SELECTING_WORD;
        room.message = "Artist left the game";
        socket.in(code).emit("round-finished", room);
        startChoosingWordInGame(room, socket, code);
      }
    });
    // για το Input game chat
    socket.on("game-input-message", (message: string) => {
      console.log("game-input-message", message);
    });
  });
});

function startChoosingWordInGame(room: Room, socket: any, code: string) {
  //starts timer for choosing word and emit event when time is up
  room.message = "";
  choosingWordTimer = setTimeout(() => {
    room.round++;
    if (room.round > room.players.length) {
      room.status = Statuses.FINISHED;
      socket.emit("game-finished", room);
      socket.in(code).emit("game-finished", room);
      delete rooms[code];
    } else {
      // if the player didn't choose a word, pass the turn to the next player
      room.currentArtist = findNextArtist(room.players, room.round);
      socket.emit("choosing-word-time-finished", room);
      socket.in(code).emit("choosing-word-time-finished", room);
      startChoosingWord(room, socket, code);
    }
  }, room.choosingWordTime);
}

function startChoosingWord(room: Room, socket: any, code: string) {
  room.status = Statuses.SELECTING_WORD;
  //starts timer for choosing word and emit event when time is up
  choosingWordTimer = setTimeout(() => {
    room.round++;
    if (room.round > room.players.length) {
      room.status = Statuses.FINISHED;
      socket.emit("game-finished", room);
      socket.in(code).emit("game-finished", room);
    } else {
      // if the player didn't choose a word, pass the turn to the next player
      room.currentArtist = findNextArtist(room.players, room.round);
      socket.emit("choosing-word-time-finished", room);
      socket.in(code).emit("choosing-word-time-finished", room);
      startChoosingWord(room, socket, code);
    }
  }, room.choosingWordTime);
}

const findDisconnectedUsersLength = (players: ConnectedUser[]) => {
  return players.filter((u) => !u.connected).length;
};

const findNextArtist = (players: ConnectedUser[], round: number) => {
  let onlinePlayers = players.filter((u) => u.connected);
  let nextArtist = onlinePlayers[round - 1];
  return nextArtist;
};
