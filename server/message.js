import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    username: String,
    content: String,
    timestamp: {type: Date, default: Date.now},
})

const Conversation = mongoose.model('${room}', messageSchema)
export { Conversation }
