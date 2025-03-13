import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },    // Matches 'name' field in MongoDB
  text: { type: String, required: true },
  channel: { type: String, required: true },  // Matches 'text' field in MongoDB
  time: { type: Date, default: Date.now },   // Matches 'time' field in MongoDB
}, { collection: "Tremblant_chat_room" });    // Ensure correct collection name

const Conversation = mongoose.model("Conversation", messageSchema);
export { Conversation };
