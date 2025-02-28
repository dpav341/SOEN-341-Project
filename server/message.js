import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: {type: Date, default: Date.now},
})

const Conversation = mongoose.model('message', messageSchema)
export { Conversation }
