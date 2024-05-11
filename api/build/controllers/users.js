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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getUser = exports.updateUser = exports.login = exports.register = void 0;
const cloudinary_1 = require("../utils/cloudinary");
const game_1 = require("../constants/game");
const user_1 = __importDefault(require("../models/user"));
const jwt = require("../utils/jwt");
const bcrypt = require("bcryptjs");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role, age, avatar } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    let avatarUrl;
    try {
        if (avatar.length <= 500) {
            avatarUrl = avatar;
        }
        else {
            const result = yield cloudinary_1.cloudinary.uploader.upload(avatar, {
                folder: "avatars",
            });
            avatarUrl = result.url;
        }
        const newUser = new user_1.default({
            username: username,
            password: hashedPassword,
            role: role,
            age: age,
            avatar: avatarUrl,
        });
        const savedUser = yield newUser.save();
        const _a = savedUser._doc, { password: _ } = _a, userWithoutPassword = __rest(_a, ["password"]);
        const accessToken = yield jwt.signAccessToken({
            id: userWithoutPassword._id,
            username: userWithoutPassword.username,
        });
        res.status(201).json(Object.assign({ token: accessToken }, userWithoutPassword));
    }
    catch (err) {
        if (err.code === 11000 && err.keyPattern.username) {
            res.status(409).json({
                message: "Username already exists",
            });
        }
        else {
            console.log(err);
            res.status(500).json({
                message: "Could not register.",
                error: JSON.stringify(err),
            });
        }
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password: userPassword } = req.body;
    try {
        const user = yield user_1.default.findOne({ username });
        if (!user) {
            return res.status(404).json({
                message: "Invalid username/password combination",
            });
        }
        const checkPassword = bcrypt.compareSync(userPassword, user.password);
        if (!checkPassword) {
            return res.status(404).json({
                message: "Invalid username/password combination",
            });
        }
        const loggedInUser = exclude(user.toObject(), "password");
        const accessToken = yield jwt.signAccessToken({
            id: loggedInUser._id,
            username: loggedInUser.username,
        });
        return res.status(200).json(Object.assign({ token: accessToken }, loggedInUser));
    }
    catch (error) {
        return res.status(500).json({
            message: "An error occurred while trying to log in",
        });
    }
});
exports.login = login;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { username, password, role, age, avatar, level, xp, game, category, words } = req.body;
    let hashedPassword;
    if (req.userId !== id) {
        return res.status(401).json({
            message: "You are not authorized",
        });
    }
    if (password) {
        hashedPassword = bcrypt.hashSync(password, 8);
    }
    try {
        let avatarUrl;
        if (avatar) {
            if (avatar.length <= 500) {
                avatarUrl = avatar;
            }
            else {
                const result = yield cloudinary_1.cloudinary.uploader.upload(avatar, {
                    folder: "avatars",
                });
                avatarUrl = result.url;
            }
        }
        let dataToUpdate = {
            username,
            role,
            age,
            avatar: avatarUrl,
            level,
            xp,
            words,
        };
        if (hashedPassword) {
            dataToUpdate.password = hashedPassword;
        }
        if (game) {
            dataToUpdate.$push = {
                games: {
                    points: game.points,
                    rank: game.rank,
                    date: new Date(),
                },
            };
        }
        if (category) {
            dataToUpdate.$push = {
                categories: category,
            };
        }
        const user = yield user_1.default.findByIdAndUpdate(id, dataToUpdate, {
            new: true,
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const _b = exclude(user.toObject(), "password"), { password: _ } = _b, userWithoutPassword = __rest(_b, ["password"]);
        res.status(200).json(userWithoutPassword);
    }
    catch (err) {
        if (err.code === 11000 && err.keyPattern.username) {
            res.status(409).json({
                message: "Username already exists",
            });
        }
        else {
            res.status(500).json({
                message: "An error occurred while updating",
                error: JSON.stringify(err),
            });
        }
    }
});
exports.updateUser = updateUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (req.userId !== id) {
        return res.status(401).json({
            message: "You are not authorized",
        });
    }
    try {
        const user = yield user_1.default.findById(id, "-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        if (user.games) {
            user.games.sort((a, b) => {
                return b.date.getTime() - a.date.getTime();
            });
        }
        if (user.games && user.games.length > 10) {
            user.games = user.games.slice(0, 10);
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({
            message: "Could not get user",
            error: JSON.stringify(err),
        });
    }
});
exports.getUser = getUser;
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sortDirection = req.query.sort;
        // You can set up default sorting here
        let sortCriteria = {};
        if (sortDirection) {
            sortCriteria = {
                level: sortDirection === "asc" ? 1 : -1,
            };
        }
        const users = yield user_1.default.find({}, "username xp level avatar games").sort(sortCriteria).exec();
        if (users && users.length > 0) {
            users.sort((a, b) => {
                return game_1.POINTS_PER_LEVEL * b.level + b.xp - (game_1.POINTS_PER_LEVEL * a.level + a.xp);
            });
        }
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({
            message: "Could not get users",
            error: err.message,
        });
    }
});
exports.getUsers = getUsers;
function exclude(user, ...keys) {
    for (let key of keys) {
        delete user[key];
    }
    return user;
}
