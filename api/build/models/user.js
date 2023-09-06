"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const { Schema } = mongoose;
const GameSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
    rank: {
        type: Number,
        required: true,
    },
});
const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 1,
    },
    avatar: {
        type: String,
    },
    age: {
        type: String,
    },
    games: [GameSchema],
});
const User = mongoose.model("User", UserSchema);
exports.default = User;
