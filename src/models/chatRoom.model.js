import mongoose from "mongoose";

const chatModel = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    name: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    locked: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    chatType: {
      type: String,
      enum: ["single", "group"],
      default: "single",
    },
    permissions: {
      onlyAdminsCanSend: { type: Boolean, default: false },
      onlyAdminsCanAddMembers: { type: Boolean, default: false },
      allowMemberLeave: { type: Boolean, default: true },
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const schemaForChat = new mongoose.model("Chat", chatModel);
