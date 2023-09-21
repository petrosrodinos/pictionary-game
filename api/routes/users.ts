const express = require("express");
const usersController = require("../controllers/users");
const wordsController = require("../controllers/words");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

router.post("/user/register", usersController.register);

router.post("/user/login", usersController.login);

router.put("/user/:id", authMiddleware, usersController.updateUser);

router.get("/user/:id", authMiddleware, usersController.getUser);

router.get("/users", authMiddleware, usersController.getUsers);

router.get("/words", authMiddleware, wordsController.getWords);

module.exports = router;
