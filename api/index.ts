import express, { Application, NextFunction, Request, Response } from "express";
import { ConnectedUser, Message, Room, Statuses } from "./interfaces/room";
import cors from "cors";
import { Points, removeGreekAccents } from "./utils/game";
const usersRoutes = require("./routes/users");
const bodyParser = require("body-parser");
const io = require("socket.io");
const mongoose = require("mongoose");
const app: Application = express();
const http = require("http").Server(app);
const path = require("path");
require("dotenv/config");

app.use(express.static(path.join(__dirname, "/uploads")));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.use("/test", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello World");
});

app.use("/api", usersRoutes);

const PORT: number = Number(process.env.PORT) || 3000;
mongoose.connect(process.env.MONGO_URI).then(() => {
  http.listen(PORT, () => {
    console.log(`Server running on Port: ${PORT}`);
  });
});

const socket = io(http, {
  cors: {
    // origin: process.env.CLIENT_ORIGIN,
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    "Access-Control-Allow-Origin": "*",
  },
});

let rooms: { [code: string]: Room } = {};
let timers: {
  [code: string]: {
    round: NodeJS.Timeout | undefined;
    choosingWord: NodeJS.Timeout | undefined;
  };
} = {};
socket.on("connection", (socket: any) => {
  //creating room
  socket.on("create-room", async (settings: Room) => {
    rooms[settings.code] = {
      ...settings,
      players: [],
      drawings: "",
      status: Statuses.CREATED,
      round: 1,
      message: "",
      lastWord: "",
      chat: [],
      usersFoundWordOrder: [],
    };
    timers[settings.code] = {
      round: undefined,
      choosingWord: undefined,
    };
  });
  //join waiting room
  socket.on("join-waiting-room", async (code: string, user: ConnectedUser) => {
    let room = rooms[code];
    console.log("ROOM", room);
    if (room) {
      //&& rooms[code].players.length !== rooms[code].maxPlayers
      //checks if user is already in room
      if (room.status == Statuses.WAITING_ROOM || room.status == Statuses.CREATED) {
        room.status = Statuses.WAITING_ROOM;
      }
      const playerToJoin = room.players.find((u) => u.userId === user.userId);
      if (!playerToJoin && room.players.length < room.maxPlayers) {
        console.log("join-waiting-room", code, user.username);
        if (user.language == room.language) {
          room.players.push({
            ...user,
            points: 0,
            connected: true,
          });
          socket.join(code);
        } else {
          socket.emit("user-joined", room);
          return;
        }
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
        room.status = Statuses.SELECTING_WORD;
        room.message = "";
        //starts timer for choosing word and emit event when time is up
        timers[code].choosingWord = setTimeout(() => {
          const nextRound = room.round + 1;

          if (
            nextRound > findConnectedUsersLength(room.players) &&
            room.status !== Statuses.FINISHED
          ) {
            clearTimeout(timers[code].round);
            room.status = Statuses.FINISHED;
            socket.emit("game-finished", room);
            socket.in(code).emit("game-finished", room);
          } else {
            // if the player didn't choose a word, pass the turn to the next player
            room.round++;
            room.currentArtist = findNextArtist(room.players, room.round);
            socket.emit("choosing-word-time-finished", room);
            socket.in(code).emit("choosing-word-time-finished", room);
          }
        }, room.choosingWordTime);
      });
      socket.on("disconnect", () => {
        if (room.status == Statuses.WAITING_ROOM && findConnectedUsersLength(room.players) === 1) {
          delete rooms[code];
        } else if (room.status == Statuses.WAITING_ROOM) {
          console.log("disconnect", code);
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
    const playerToJoin = room.players.find((u) => u.userId === user.userId);

    if (!playerToJoin) {
      room.players.push({
        ...user,
        points: 0,
        connected: true,
      });
    } else if (playerToJoin && !playerToJoin?.connected) {
      room.players = room.players.map((u) => {
        if (u.userId === user.userId) {
          u.connected = true;
        }
        return u;
      });
    }

    console.log("join-room", code);
    socket.join(code);
    socket.emit("send-info", room);
    //when artist drawing transmits data to other players
    socket.on("send-changes", (data: any) => {
      if (data == null) {
        room.drawings = "";
      }
      // socket.in(code).emit("receive-changes", data);
      socket.to(code).emit("receive-changes", data);
      if (data) {
        room.drawings = data;
      }
    });
    //when artist selects word
    socket.on("word-selected", (code: string, word: string) => {
      const room = rooms[code];
      clearTimeout(timers[code].choosingWord);
      clearTimeout(timers[code].round);
      room.usersFoundWordOrder = [];
      room.chat = [];
      room.drawings = "";
      room.word = word;
      room.status = Statuses.PLAYING;
      socket.emit("word-changed", room);
      socket.in(code).emit("word-changed", room);
      //starts timer for round and emit event when time is up
      timers[code].round = setTimeout(() => {
        room.lastWord = room.word;
        startNextRound(room, socket, code);
      }, room.roundTime + 1000);
    });
    socket.on("disconnect", () => {
      room.players = room.players.map((u) => {
        if (u.userId === user.userId) {
          u.connected = false;
        }
        return u;
      });

      console.log(
        "disconnect",
        findConnectedUsersLength(room.players),
        room.maxPlayers,
        room.status
      );

      if (findConnectedUsersLength(room.players) == 1 && room.status !== Statuses.FINISHED) {
        clearTimeout(timers[code].choosingWord);
        clearTimeout(timers[code].round);
        room.message = "Looks like game is finished";
        room.status = Statuses.FINISHED;
        socket.in(code).emit("all-users-left", room);
        delete rooms[code];
        return;
      }
      //if artist left the game
      if (
        room.currentArtist &&
        room.currentArtist.userId === user.userId &&
        room.status !== Statuses.FINISHED
      ) {
        room.word = "";
        room.currentArtist = findNextArtist(room.players, room.round);
        room.status = Statuses.SELECTING_WORD;
        room.message = "Artist left the game";
        socket.in(code).emit("round-finished", room);
        clearTimeout(timers[code].round);
        startChoosingWord(room, socket, code);
      }
    });
    socket.on("game-input-message", (message: Message) => {
      const newMessage = message;
      const cleanedMessage = removeGreekAccents(message.message);
      const cleanedWord = removeGreekAccents(room.word);

      if (cleanedMessage === cleanedWord && !room.usersFoundWordOrder.includes(message.userId)) {
        room.players = room.players.map((u) => {
          if (u.userId === message.userId) {
            room.usersFoundWordOrder.push(u.userId);
            u.points += Points[room.usersFoundWordOrder.length];
          }
          return u;
        });
        newMessage.correct = true;
      } else {
        newMessage.correct = false;
      }
      room.chat.push(newMessage);
      socket.in(code).emit("chat-message", room);
      socket.emit("chat-message", room);
      if (room.usersFoundWordOrder.length === room.players.length - 1) {
        startNextRound(room, socket, code);
      }
    });
  });
});

function startNextRound(room: Room, socket: any, code: string) {
  room.word = "";
  let nextRound = room.round + 1;
  if (nextRound > findConnectedUsersLength(room.players) && room.status !== Statuses.FINISHED) {
    room.status = Statuses.FINISHED;
    socket.emit("game-finished", room);
    socket.in(code).emit("game-finished", room);
    clearTimeout(timers[code].choosingWord);
    clearTimeout(timers[code].round);
    delete rooms[code];
    return;
  }
  room.status = Statuses.SELECTING_WORD;
  room.round++;
  room.currentArtist = findNextArtist(room.players, room.round);
  socket.emit("round-finished", room);
  socket.in(code).emit("round-finished", room);
  startChoosingWord(room, socket, code);
}

function startChoosingWord(room: Room, socket: any, code: string) {
  room.message = "";
  room.status = Statuses.SELECTING_WORD;
  //starts timer for choosing word and emit event when time is up
  clearTimeout(timers[code].choosingWord);
  timers[code].choosingWord = setTimeout(() => {
    const nextRound = room.round + 1;

    if (nextRound > findConnectedUsersLength(room.players) && room.status !== Statuses.FINISHED) {
      clearTimeout(timers[code].round);
      room.status = Statuses.FINISHED;
      socket.emit("game-finished", room);
      socket.in(code).emit("game-finished", room);
      delete rooms[code];
    } else {
      // if the player didn't choose a word, pass the turn to the next player
      room.round++;
      room.currentArtist = findNextArtist(room.players, room.round);
      socket.emit("choosing-word-time-finished", room);
      socket.in(code).emit("choosing-word-time-finished", room);
      startChoosingWord(room, socket, code);
    }
  }, room.choosingWordTime);
}

const findConnectedUsersLength = (players: ConnectedUser[]) => {
  return players.filter((u) => u.connected).length;
};

const findNextArtist = (players: ConnectedUser[], round: number) => {
  let onlinePlayers = players.filter((u) => u.connected);
  let nextArtist = onlinePlayers[round - 1];
  return nextArtist;
};
