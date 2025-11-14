import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./src/db/index.js";
import userRoutes from "./src/routes/user.routes.js";
import lockChatRoutes from "./src/routes/lockChat.routes.js";
import { initializeSockets } from "./src/methods/socketManager.methods.js";
import { Expo } from "expo-server-sdk";
dotenv.config();
const app = express();
const expo = new Expo();
const tokens = new Set();
app.use(express.json());
const server = http.createServer(app);
const port = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});

// io.on("connection", (socket) => {
//   console.log("user connected: ", socket.id);

//   socket.on("message", (message) => {
//     console.log("user message on server", message);
//     io.emit("message", message);
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected: ", socket.id);
//   });
// });
initializeSockets(io);

app.use("/api/user", userRoutes);
app.use("/api/chat", lockChatRoutes);
app.get("/", async (req, res) => {
  res.send("Hello ChatBox");
});

server.listen(port, "0.0.0.0", () => {
  console.log("Server is running on port 3000");
});

(async () => {
  try {
    const res = await connectDB();
    console.log(res);
  } catch (err) {
    console.log(err);
  }
})();
