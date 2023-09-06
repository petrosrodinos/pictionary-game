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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const { verifyAccessToken } = require("../utils/jwt");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = yield verifyAccessToken(token);
            if (!token || !decoded || !decoded.id) {
                return res.status(401).send({ message: "You are not authorized" });
            }
            req.userId = decoded.id;
            next();
        }
        catch (error) {
            console.log(error);
            return res.status(401).send({ message: "You are not authorized" });
        }
    }
    if (!token) {
        return res.status(401).send({ message: "You are not authorized" });
    }
});
exports.authMiddleware = authMiddleware;
