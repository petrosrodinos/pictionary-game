"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const room_1 = require("./interfaces/room");
const cors_1 = __importDefault(require("cors"));
const game_1 = require("./utils/game");
const usersRoutes = require("./routes/users");
const bodyParser = require("body-parser");
const io = require("socket.io");
const mongoose = require("mongoose");
const app = (0, express_1.default)();
const http = require("http").Server(app);
require("dotenv/config");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use((0, cors_1.default)());
app.use("/test", (res) => {
    res.send("Hello World");
});
app.use("/api", usersRoutes);
const PORT = Number(process.env.PORT) || 3000;
mongoose.connect(process.env.MONGO_URI).then(() => {
    http.listen(PORT, () => {
        console.log(`Server running on Port: ${PORT}`);
    });
});
const socket = io(http, {
    cors: {
        origin: process.env.CLIENT_ORIGIN,
        transports: ["polling"],
        // origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        "Access-Control-Allow-Origin": "*",
    },
});
let rooms = {};
let timers = {};
socket.on("connection", (socket) => {
    //creating room
    socket.on("create-room", (settings) => __awaiter(void 0, void 0, void 0, function* () {
        rooms[settings.code] = Object.assign(Object.assign({}, settings), { players: [], drawings: "", status: room_1.Statuses.CREATED, round: 1, message: "", lastWord: "", chat: [], usersFoundWordOrder: [] });
        timers[settings.code] = {
            round: undefined,
            choosingWord: undefined,
        };
    }));
    //join waiting room
    socket.on("join-waiting-room", (code, user) => __awaiter(void 0, void 0, void 0, function* () {
        let room = rooms[code];
        if (room) {
            //&& rooms[code].players.length !== rooms[code].maxPlayers
            //checks if user is already in room
            socket.join(code);
            if (room.status == room_1.Statuses.WAITING_ROOM || room.status == room_1.Statuses.CREATED) {
                room.status = room_1.Statuses.WAITING_ROOM;
            }
            const playerToJoin = room.players.find((u) => u.userId === user.userId);
            if (!playerToJoin && room.players.length < room.maxPlayers) {
                console.log("join-waiting-room", code);
                room.players.push(Object.assign(Object.assign({}, user), { points: 0, connected: true }));
                socket.in(code).emit("user-joined", room);
                socket.emit("user-joined", room);
            }
            else if (playerToJoin && !(playerToJoin === null || playerToJoin === void 0 ? void 0 : playerToJoin.connected)) {
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
            if (room.status == room_1.Statuses.WAITING_ROOM && room.players.length === room.maxPlayers) {
                room.currentArtist = room.players[0];
                socket.in(code).emit("game-started", room);
                socket.emit("game-started", room);
                //starts timer for choosing word and emit event when time is up
                startChoosingWord(room, socket, code);
            }
            //when creator presses start game
            socket.on("start-game", (code) => {
                room.currentArtist = room.players[0];
                socket.in(code).emit("game-started", room);
                socket.emit("game-started", room);
                //starts timer for choosing word and emit event when time is up
                room.status = room_1.Statuses.SELECTING_WORD;
                room.message = "";
                //starts timer for choosing word and emit event when time is up
                timers[code].choosingWord = setTimeout(() => {
                    const nextRound = room.round + 1;
                    if (nextRound > findConnectedUsersLength(room.players) &&
                        room.status !== room_1.Statuses.FINISHED) {
                        clearTimeout(timers[code].round);
                        room.status = room_1.Statuses.FINISHED;
                        socket.emit("game-finished", room);
                        socket.in(code).emit("game-finished", room);
                    }
                    else {
                        // if the player didn't choose a word, pass the turn to the next player
                        room.round++;
                        room.currentArtist = findNextArtist(room.players, room.round);
                        socket.emit("choosing-word-time-finished", room);
                        socket.in(code).emit("choosing-word-time-finished", room);
                    }
                }, room.choosingWordTime);
            });
            socket.on("disconnect", () => {
                if (room.status == room_1.Statuses.WAITING_ROOM && findConnectedUsersLength(room.players) === 1) {
                    delete rooms[code];
                }
                else if (room.status == room_1.Statuses.WAITING_ROOM) {
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
    }));
    //join playing room
    socket.on("join-room", (code, user) => __awaiter(void 0, void 0, void 0, function* () {
        let room = rooms[code];
        if (!room || room.players.length > room.maxPlayers)
            return;
        const playerToJoin = room.players.find((u) => u.userId === user.userId);
        if (!playerToJoin) {
            room.players.push(Object.assign(Object.assign({}, user), { points: 0, connected: true }));
        }
        else if (playerToJoin && !(playerToJoin === null || playerToJoin === void 0 ? void 0 : playerToJoin.connected)) {
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
        socket.on("send-changes", (data) => {
            if (data == null) {
                room.drawings = "";
            }
            // socket.in(code).emit("receive-changes", data);
            socket.broadcast.to(code).emit("receive-changes", data);
            if (data) {
                room.drawings = data;
            }
        });
        //when artist selects word
        socket.on("word-selected", (code, word) => {
            const room = rooms[code];
            clearTimeout(timers[code].choosingWord);
            clearTimeout(timers[code].round);
            room.usersFoundWordOrder = [];
            room.chat = [];
            room.drawings = "";
            room.word = word;
            room.status = room_1.Statuses.PLAYING;
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
            console.log("disconnect", findConnectedUsersLength(room.players), room.maxPlayers, room.status);
            if (findConnectedUsersLength(room.players) === 1 &&
                room.maxPlayers > 2 &&
                room.status !== room_1.Statuses.FINISHED) {
                clearTimeout(timers[code].choosingWord);
                clearTimeout(timers[code].round);
                room.message = "Looks like game is finished";
                room.status = room_1.Statuses.FINISHED;
                socket.in(code).emit("all-users-left", room);
                delete rooms[code];
                return;
            }
            //if artist left the game
            if (room.currentArtist &&
                room.currentArtist.userId === user.userId &&
                room.status !== room_1.Statuses.FINISHED) {
                room.word = "";
                room.currentArtist = findNextArtist(room.players, room.round);
                room.status = room_1.Statuses.SELECTING_WORD;
                room.message = "Artist left the game";
                socket.in(code).emit("round-finished", room);
                startChoosingWord(room, socket, code);
            }
        });
        socket.on("game-input-message", (message) => {
            const newMessage = message;
            const cleanedMessage = (0, game_1.removeGreekAccents)(message.message);
            const cleanedWord = (0, game_1.removeGreekAccents)(room.word);
            if (cleanedMessage === cleanedWord && !room.usersFoundWordOrder.includes(message.userId)) {
                room.players = room.players.map((u) => {
                    if (u.userId === message.userId) {
                        room.usersFoundWordOrder.push(u.userId);
                        u.points += game_1.Points[room.usersFoundWordOrder.length];
                    }
                    return u;
                });
                newMessage.correct = true;
            }
            else {
                newMessage.correct = false;
            }
            room.chat.push(newMessage);
            socket.in(code).emit("chat-message", room);
            socket.emit("chat-message", room);
            if (room.usersFoundWordOrder.length === room.players.length - 1) {
                startNextRound(room, socket, code);
            }
        });
    }));
});
function startNextRound(room, socket, code) {
    room.word = "";
    let nextRound = room.round + 1;
    if (nextRound > findConnectedUsersLength(room.players) && room.status !== room_1.Statuses.FINISHED) {
        room.status = room_1.Statuses.FINISHED;
        socket.emit("game-finished", room);
        socket.in(code).emit("game-finished", room);
        clearTimeout(timers[code].choosingWord);
        clearTimeout(timers[code].round);
        delete rooms[code];
        return;
    }
    room.status = room_1.Statuses.SELECTING_WORD;
    room.round++;
    room.currentArtist = findNextArtist(room.players, room.round);
    socket.emit("round-finished", room);
    socket.in(code).emit("round-finished", room);
    startChoosingWord(room, socket, code);
}
function startChoosingWord(room, socket, code) {
    room.message = "";
    room.status = room_1.Statuses.SELECTING_WORD;
    //starts timer for choosing word and emit event when time is up
    clearTimeout(timers[code].choosingWord);
    timers[code].choosingWord = setTimeout(() => {
        const nextRound = room.round + 1;
        if (nextRound > findConnectedUsersLength(room.players) && room.status !== room_1.Statuses.FINISHED) {
            clearTimeout(timers[code].round);
            room.status = room_1.Statuses.FINISHED;
            socket.emit("game-finished", room);
            socket.in(code).emit("game-finished", room);
            delete rooms[code];
        }
        else {
            // if the player didn't choose a word, pass the turn to the next player
            room.round++;
            room.currentArtist = findNextArtist(room.players, room.round);
            socket.emit("choosing-word-time-finished", room);
            socket.in(code).emit("choosing-word-time-finished", room);
            startChoosingWord(room, socket, code);
        }
    }, room.choosingWordTime);
}
const findConnectedUsersLength = (players) => {
    return players.filter((u) => u.connected).length;
};
const findNextArtist = (players, round) => {
    let onlinePlayers = players.filter((u) => u.connected);
    let nextArtist = onlinePlayers[round - 1];
    return nextArtist;
};
