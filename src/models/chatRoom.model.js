  import mongoose, { Mongoose } from "mongoose";

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
          type: Mongoose.Schema.Types.ObjectId,
          ref: "Message",
        },
      ],
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
    },
    {
      timestamps: true,
    }
  );

  export const schemaForChat = new mongoose.model("Chat", chatModel);
