"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBase64 = void 0;
const isBase64 = (str) => {
    try {
        return Buffer.from(str, "base64").toString("base64") === str;
    }
    catch (err) {
        return false;
    }
};
exports.isBase64 = isBase64;
