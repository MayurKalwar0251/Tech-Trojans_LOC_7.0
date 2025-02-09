const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "PoliceMember" },
    receiver: [{ type: mongoose.Schema.Types.ObjectId, ref: "PoliceMember" }],
    content: {
      type: String,
      trim: true,
    },
    fileContent: { type: String },
    fileType: { type: String },
    chatBW: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, strictPopulate: false }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
