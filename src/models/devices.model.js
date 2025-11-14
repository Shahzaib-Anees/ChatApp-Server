import mongoose, { Mongoose } from "mongoose";

const deviceSchema = new mongoose.Schema({
  userId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notification_token: {
    type: String,
    required: true,
    unique: true,
  },
  platform: {
    type: String,
    enum: ["ios", "android"],
    required: true,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
});


export const Device = mongoose.model("Device", deviceSchema);
