import mongoose from "mongoose";

const chatModel = new mongoose.Schema(
  {
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "moderator", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        lastSeenMessageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message",
        },
        notifications: {
          type: Boolean,
          default: true,
        },
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
    settings: {
      isLocked: {
        type: Boolean,
        default: false,
      },
      isArchived: {
        type: Boolean,
        default: false,
      },
      isPrivate: {
        type: Boolean,
        default: true,
      },
      maxMembers: {
        type: Number,
        default: function () {
          return this.chatType === "group" ? 256 : 2;
        },
      },
    },
    chatType: {
      type: String,
      enum: ["single", "group"],
      default: "single",
    },
    permissions: {
      onlyAdminsCanSend: {
        type: Boolean,
        default: false,
      },
      onlyAdminsCanAddMembers: {
        type: Boolean,
        default: false,
      },
      onlyAdminsCanRemoveMembers: {
        type: Boolean,
        default: true,
      },
      allowMemberLeave: {
        type: Boolean,
        default: true,
      },
      allowMessageEdit: {
        type: Boolean,
        default: true,
      },
      allowMessageDelete: {
        type: Boolean,
        default: true,
      },
      messageRetentionDays: {
        type: Number,
        default: 0,
      },
    },
    avatar: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: "Avatar must be a valid URL",
      },
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

chatSchema.index({ "members.user": 1 });
chatSchema.index({ lastActivity: -1 });
chatSchema.index({ chatType: 1 });
chatSchema.index({ createdBy: 1 });
chatSchema.virtual("activeMembersCount").get(function () {
  return this.members ? this.members.length : 0;
});
chatSchema.pre("save", function (next) {
  if (this.members && this.members.length > this.settings.maxMembers) {
    return next(
      new Error(`Maximum ${this.settings.maxMembers} members allowed`)
    );
  }
  next();
});

export const schemaForChat = new mongoose.model("Chat", chatModel);
