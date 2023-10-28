import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import SeedRoutes from "./controllers/seed.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import { Server } from "socket.io";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3005;
const BASE_URL = process.env.BASE_URL || "http://localhost";

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/audios", express.static("uploads/audios"));

app.use("/api/auth", AuthRoutes);
app.use("/api", SeedRoutes);
app.use("/api/messages", MessageRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server started on ${BASE_URL}:${PORT}`);
});
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    console.log("User connected: ", userId);
    onlineUsers.set(userId, socket.id);
  });
  socket.on("msg-send", (msg) => {
    console.log("New message: ", msg);
    const sendUserSocket = onlineUsers.get(msg.to);
    if (sendUserSocket) {
      console.log("User is online Emitting message: " + sendUserSocket);
      socket.to(sendUserSocket).emit("msg-receive", {
        message: msg.message,
        from: msg.from,
      });
    }
  });
});
