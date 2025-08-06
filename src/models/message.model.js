import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    messageType: {
      type: String,
      enum: [
        "text",
        "image",
        "file",
        "video",
        "audio",
        "voice",
        "location",
        "contact",
        "poll",
        "system",
      ],
      default: "text",
    },
    content: {
      text: {
        type: String,
        trim: true,
        maxlength: 4000,
      },
    },
    media: {
      files: [
        {
          url: {
            type: String,
            required: function () {
              return ["image", "file", "video", "audio", "voice"].includes(
                this.messageType
              );
            },
          },
          filename: String,
          originalName: String,
          size: {
            type: Number,
            min: 0,
          },
          mimeType: String,
          duration: Number, // for audio/video files
          dimensions: {
            width: Number,
            height: Number,
          },
          thumbnail: String,
        },
      ],
    },
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
      placeName: String,
    },
    poll: {
      question: String,
      options: [
        {
          text: String,
          votes: [
            {
              user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
              votedAt: {
                type: Date,
                default: Date.now,
              },
            },
          ],
        },
      ],
      allowMultipleAnswers: {
        type: Boolean,
        default: false,
      },
      expiresAt: Date,
    },
    editHistory: [
      {
        editedAt: {
          type: Date,
          default: Date.now,
        },
        previousContent: String,
        editedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    systemMessage: {
      type: {
        type: String,
        enum: [
          "member_added",
          "member_removed",
          "member_left",
          "chat_created",
          "name_changed",
          "avatar_changed",
        ],
      },
      data: mongoose.Schema.Types.Mixed,
    },
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        emoji: {
          type: String,
          maxlength: 10,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    replyTo: {
      messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
      snippet: {
        type: String,
        maxlength: 100,
      },
    },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["sending", "sent", "delivered", "read", "failed"],
      default: "sent",
    },
    forwardedFrom: {
      originalMessageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
      originalSender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      originalChatRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
      forwardedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      forwardCount: {
        type: Number,
        default: 1,
      },
      mentions: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          displayText: String,
        },
      ],
      isForwarded: {
        type: Boolean,
        default: false,
      },
    },
    deletedForUsers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        deletedAt: {
          type: Date,
          default: Date.now,
        },
        deleteType: {
          type: String,
          enum: ["delete_for_me", "hide_message", "archive"],
          default: "delete_for_me",
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

messageSchema.index({ chatRoom: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ "readBy.user": 1 });
messageSchema.index({ messageType: 1 });
messageSchema.index({ isDeleted: 1 });

messageSchema.virtual("reactionCounts").get(function () {
  const counts = {};
  if (this.reactions) {
    this.reactions.forEach((reaction) => {
      counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1;
    });
  }
  return counts;
});

messageSchema.pre("save", function (next) {
  if (this.messageType === "text" && !this.content?.text?.trim()) {
    return next(new Error("Text message must have content"));
  }

  if (
    ["image", "file", "video", "audio"].includes(this.messageType) &&
    (!this.media?.files || this.media.files.length === 0)
  ) {
    return next(new Error(`${this.messageType} message must have media files`));
  }

  if (
    this.messageType === "location" &&
    (!this.location?.latitude || !this.location?.longitude)
  ) {
    return next(new Error("Location message must have coordinates"));
  }

  next();
});

export const schemaForMessage = new mongoose.model("Message", messageSchema);
