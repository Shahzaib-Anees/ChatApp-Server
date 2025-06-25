import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    chatRoomid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    messageType: {
      type: String,
      enum: ["text", "image", "file", "video", "audio", "forwarded"],
      default: "text",
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    forwardedFrom: {
      originalMessageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        // ID of the original message being forwarded
      },
      originalSender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // Who originally sent the message
      },
      originalChatRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        // Which chat room the original message came from
      },
      forwardedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // Who forwarded this message (same as sender for direct forwards)
      },
      forwardCount: {
        type: Number,
        default: 1,
        // How many times this message has been forwarded
      },
      isForwarded: {
        type: Boolean,
        default: false,
      },
    },

    media: {
      url: String,
      filename: String,
      size: Number,
      mimeType: String,
    },
  },
  {
    timestamps: true,
  }
);

export const schemaForMessage = new mongoose.model("Message", messageSchema);
