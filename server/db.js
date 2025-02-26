import mongoose from 'mongoose'
export const getRoomCollection = (room) => mongoose.connection.collection(`room_chat_${room}`);
export function Connection() {
    const mongoURI = "mongodb+srv://soen341projectw2025:<password>@skigo-cluster.fduxd.mongodb.net/?retryWrites=true&w=majority&appName=SkiGo-Cluster"
    mongoose.connect(mongoURI)
    .then(() => console.log("connected"))
    .catch(err => console.log(err))
}
