import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { schemaForUser } from "../models/user.model.js";
dotenv.config();
const socketAuthHandler = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      console.log("Authentication error: No token provided");
      return next(new Error("Authentication error: No token provided"));
    }
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    const existingUser =await schemaForUser.findOne({ email: decodedToken?.email });
    if (!existingUser) {
      return next(new Error("User not found"));
    }
    socket.userId = existingUser._id;
    next();
  } catch (error) {
    return next(new Error("Authentication error: Invalid token"));
  }
};

export { socketAuthHandler };
