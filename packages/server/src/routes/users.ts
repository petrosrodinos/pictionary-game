const express = require("express");
const usersController = require("../controllers/users");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

router.post("/user/register", usersController.register);

router.post("/user/login", usersController.login);

router.put("/user/:id", authMiddleware, usersController.updateUser);

router.get("/user/:id", authMiddleware, usersController.getUser);

router.get("/users", usersController.getUsers);

module.exports = router;
