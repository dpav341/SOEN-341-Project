const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },    // Use 'name' instead of 'sender'
  text: { type: String, required: true },    // Use 'text' instead of 'content'
  time: { type: Date, default: Date.now }    // Use 'time' instead of 'timeStamp'
}, { collection: "Tremblant_chat_room" });

const Conversation = mongoose.model('Conversation', messageSchema);
export { Conversation };
