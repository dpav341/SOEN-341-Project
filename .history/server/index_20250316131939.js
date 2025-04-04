import express from 'express';
import { Server } from "socket.io";
import { Connection } from './db.js';
import { saveMessage, getMessages } from './message.js'; // Make sure these imports are correct

const app = express();
const PORT = process.env.PORT || 3500;

const expressServer = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

Connection();

const io = new Server(expressServer, {
    cors: {
        origin: ["http://localhost:3000"]  // Adjust if needed
    }
});

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`);

    socket.on('message', async ({ name, text }) => {
        if (name && text) {
            const messageData = { username: name, message: text };
            await saveMessage(name, text);  // Save message to MongoDB
            io.emit('message', messageData); // Broadcast message to all clients
        }
    });

    socket.on('requestMessages', async () => {
        const messages = await getMessages();
        socket.emit('messageList', messages);
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    });
});
