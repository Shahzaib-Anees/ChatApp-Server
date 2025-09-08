import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { type } from "os";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
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
    secretLockCode: {
      type: String,
      default: "",
    },
    pinnedChats: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ChatRoom",
        },
      ],
      validate: {
        validator: function (v) {
          return val.length <= 3;
        },
        message: "You can pin up to 3 chats only",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const encryptedPassword = await bcrypt.hash(this.password, 10);
  this.password = encryptedPassword;
  return next();
});

export const schemaForUser = new mongoose.model("User", userSchema);
