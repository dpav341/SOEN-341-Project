import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  sender: String,
  content: String,
  channel: String,
  timeStamp: { type: Date, default: Date.now },
}, { collection: "Tremblant_chat_room" }); // Force Mongoose to use this collection

export const Conversation = mongoose.model("Conversation", ConversationSchema);
