const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// require("dotenv").config();

const accessTokenSecret = process.env.JWT_SECRET;

module.exports = {
  signAccessToken(payload: any) {
    return new Promise((resolve, reject) => {
      jwt.sign({ payload }, accessTokenSecret, {}, (err: any, token: any) => {
        if (err) {
          reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken(token: any) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, accessTokenSecret, (err: any, payload: any) => {
        if (err) {
          const message = err.name == "JsonWebTokenError" ? "Unauthorized" : err.message;
          return reject(createError.Unauthorized(message));
        }
        resolve(payload.payload);
      });
    });
  },
};
