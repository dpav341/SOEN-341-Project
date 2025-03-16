
import mongoose from 'mongoose'

// export const getRoomCollection = (room) => mongoose.connection.collection(`room_chat_${room}`);

export function Connection() {
  const mongoURI = "mongodb+srv://soen341projectw2025:mernstack@skigo-cluster.fduxd.mongodb.net/?retryWrites=true&w=majority&appName=SkiGo-Cluster"
  mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB."))
    .catch(err => console.log(err))
}