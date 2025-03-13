import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  channel: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now }
}, { collection: "Tremblant_chat_room" })

const Conversation = mongoose.model('Conversation', messageSchema, "Tremblant_chat_room");
export { Conversation }