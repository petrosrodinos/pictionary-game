const app = require("express")();
const http = require("http").Server(app);
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const mongoose = require("mongoose");
const { errorHandler } = require("./middleware/errorMiddleware");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const io = require("socket.io");

const rateLimmiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  headers: true,
  handler: function (req, res) {
    return res.json({
      message: "Too many login attemps,please try again later",
    });
  },
});

app.use(cors());

app.use(bodyParser.json());

app.use("/api/user", rateLimmiter, authRoutes);
app.use("/api/chat", chatRoutes);

app.use((req, res, next) => {
  return res.json({ message: "Route doesnt exists" });
});

app.use(errorHandler);

PORT = process.env.PORT;

mongoose
  .set("strictQuery", false)
  .connect("mongodb://localhost/pictionary", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    http.listen(PORT, () => {
      console.log("Listening...");
    });
  })
  .catch((error) => {
    console.log(error);
    throw new Error("Could not connect to database.");
  });

const socket = io(http, {
  cors: {
    origin: process.env.IO_ORIGIN,
    methods: ["GET", "POST"],
  },
});

socket.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    console.log("get-document", documentId);
    socket.join(documentId);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });
  });
});
