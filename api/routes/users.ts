const express = require("express");
const usersController = require("../controllers/users");
const wordsController = require("../controllers/words");
const { authMiddleware } = require("../middlewares/auth");
const uploader = require("../utils/multer");

const router = express.Router();

router.post("/user/register", uploader.single("avatar"), usersController.register);

router.post("/user/login", usersController.login);

router.put("/user/:id", authMiddleware, uploader.single("avatar"), usersController.updateUser);

router.get("/user/:id", authMiddleware, usersController.getUser);

router.get("/users", authMiddleware, usersController.getUsers);

router.get("/words", authMiddleware, wordsController.getWords);

router.delete("/user/:id/category/:categoryId", authMiddleware, usersController.removeCategory);

module.exports = router;
