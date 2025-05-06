import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    chat_room_id: [ 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
      },
    ],
    messageType: {
      type: String,
      enum: ["text", "image", "file", "video", "audio"],
      default: "text",
    },
    status: {
      type: String,
      enum: ["sent", "unseen", "seen"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  }
);

export const schemaForMessage = new mongoose.model("Message", messageSchema);
