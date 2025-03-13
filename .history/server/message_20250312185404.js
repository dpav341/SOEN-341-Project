import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  channel: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now }
})

export const Conversation = mongoose.model("Conversation", ConversationSchema);
