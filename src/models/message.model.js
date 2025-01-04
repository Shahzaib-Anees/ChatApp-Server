import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
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
