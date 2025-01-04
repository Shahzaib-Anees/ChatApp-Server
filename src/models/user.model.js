import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const encryptedPassword = await bcrypt.hash(this.password, 10);
  this.password = encryptedPassword;
  return next();
});

export const schemaForUser = new mongoose.model("User", userSchema);
