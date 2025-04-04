import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
});

const Conversation = mongoose.model('message', messageSchema);

// Function to save a message to MongoDB
async function saveMessage(username, message) {
    try {
        const newMessage = new Conversation({ username, message });
        await newMessage.save();
        console.log("Message saved:", newMessage);
    } catch (error) {
        console.error("Error saving message:", error);
    }
}

// Function to retrieve messages from MongoDB
async function getMessages() {
    try {
        return await Conversation.find().sort({ timestamp: 1 }).exec();
    } catch (error) {
        console.error("Error retrieving messages:", error);
        return [];
    }
}