import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      uniqure: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    contacts: [
      {
        type: String,
      },
    ],
    profilePicture: {
      type: String,
      default: "",
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    chatRooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatRoom",
      },
    ],
    about: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const schemaForUser = new mongoose.model("User", userSchema);
