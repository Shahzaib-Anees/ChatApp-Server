import { socketAuthHandler } from "../middlewares/socket.middleware.js";
import { schemaForUser } from "../models/user.model.js";

const initializeSocker = (io) => {
  io.use(socketAuthHandler);
};

const handleConnection = async (socket) => {
  const userId = socket.userId;
  console.log(`User connected: ${userId}`);
  await updateUserStatus(userId, true);
  await joinUserRooms(socket, userId);

  socket.on("disconnect", async () => {
    await updateUserStatus(userId, false);
    console.log(`User disconnected: ${userId}`);
  });
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
