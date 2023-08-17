const express = require("express");
const usersController = require("../controllers/users");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", usersController.register);

router.post("/login", usersController.login);

router.put("/user/:id", authMiddleware, usersController.updateUser);

router.get("/user/:id", authMiddleware, usersController.getUser);

module.exports = router;
