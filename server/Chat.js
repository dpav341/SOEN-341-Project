import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: {type: Date, default: Date.now},
    //room_id: String
})

const Chat = mongoose.model('room_chat_Rap', chatSchema)
export { Chat }
