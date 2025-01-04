import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./src/db/index.js";
import userRoutes from "./src/routes/user.routes.js";
dotenv.config();
const app = express();
app.use(express.json());
const server = http.createServer(app);
const port = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use("/api/user", userRoutes);

(async () => {
  try {
    const res = await connectDB();
    console.log(res);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
})();
