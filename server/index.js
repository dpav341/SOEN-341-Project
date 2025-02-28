import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Connection } from './db.js';
import mongoose from 'mongoose';
import { Conversation } from './message.js';

const app = express();
app.use(express.json());

Connection();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on('connection', (socket) => {
    console.log('Connected');

    const loadMessageList = async () => {
        try {
            const messageList = await Conversation.find().sort({ timeStamp: 1 }).exec();
            socket.emit('messageList', messageList);
        } catch (err) {
            console.error(err);
        }
    };
    
    loadMessageList();

    socket.on('newMessage', async (msg) => {
        try {
            const newMessage = new Conversation(msg);
            await newMessage.save();
            io.emit('message', newMessage);
        } catch (err) {
            console.error(err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Disconnected');
    });
});

server.listen(8080, () => {
    console.log('Server running on port 8080');
});
