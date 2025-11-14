import { socketAuthHandler } from "../middlewares/socket.middleware.js";
import { schemaForUser } from "../models/user.model.js";

const initializeSockets = (io) => {
  io.use(socketAuthHandler);
  io.on("connection", handleConnection);
};

const handleConnection = async (socket) => {
  try {
    const userId = socket.userId;
    console.log(`User connected: ${userId}`);
    await updateUserStatus(userId, true);
    await joinUserRooms(socket, userId);
    // setupMessageHandlers(socket, io);
    // setupStatusHandlers(socket, io);

    // Handle disconnection
    socket.on("disconnect", async () => {
      await updateUserStatus(userId, false);
      console.log(`User disconnected: ${userId}`);
    });
  } catch (error) {
    console.error("Socket connection error:", error);
  }
};

const updateUserStatus = async (userId, status) => {
  if (status === true) {
    await schemaForUser.findByIdAndUpdate(userId, {
      lastSeen: new Date(),
    });
  }
};

const joinUserRooms = async (socket, userId) => {
  const existingUser = await schemaForUser.findById(userId);
  if (existingUser) {
    const userChatRooms = existingUser?.chatRooms;
    if (
      userChatRooms &&
      Array.isArray(userChatRooms) &&
      userChatRooms.length > 0
    ) {
      userChatRooms.forEach((roomId) => {
        socket.join(roomId.toString());
      });
    }
  }
};

export { initializeSockets, handleConnection };
