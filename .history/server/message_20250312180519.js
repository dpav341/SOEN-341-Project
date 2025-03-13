
import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  sender: String,   // Map 'name' → 'sender'
  content: String,  // Map 'text' → 'content'
  timeStamp: Date,  // Map 'time' → 'timeStamp'
}, { collection: "Tremblant_chat_room" }); // Ensure correct collection name

// Preprocess data to rename fields when retrieving
ConversationSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.sender = ret.name;
    ret.content = ret.text;
    ret.timeStamp = ret.time;
    delete ret.name;
    delete ret.text;
    delete ret.time;
  }
});

export const Conversation = mongoose.model("Conversation", ConversationSchema);
