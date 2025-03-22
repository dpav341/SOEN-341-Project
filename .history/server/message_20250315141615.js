import mongoose from 'mongoose'

export const getDMCollection = (name, room) => mongoose.connection.collection(`${name}_to_${room}_dm_chat`);

export const getChannelCollection = (room) => mongoose.connection.collection(`${room}_chat_room`);

export async function saveMessage(room, name, text) {
    if (room !== "Tremblant" && room !== "Sutton") {
        const collection = getDMCollection(name, room);
        await collection.insertOne({
            name,
            text,
            time: new Date(),
        });
        const collectionRecipient = getDMCollection(room, name);
        await collectionRecipient.insertOne({
            name,
            text,
            time: new Date(),
        });
    }
    else {
        const collection = getChannelCollection(room);
        await collection.insertOne({
         name,
            text,
            time: new Date(),
        });
    }
}
