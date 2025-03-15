import mongoose from "mongoose";

const chatModel = new mongoose.Schema(
  {
    member1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    member2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

export const schemaForChat = new mongoose.model("Chat", chatModel);
