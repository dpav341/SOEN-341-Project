import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Connection } from './db.js';
import mongoose from 'mongoose';
import { Conversation } from './message.js';

const app = express()
app.use(express.json())
Connection()


const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

let users = [];
const allMessages = {
  general: [],
  tremblant: [],
  saintAnne: [],
}

io.on("connection", (socket) => {
  console.log("connected");

  // Load previous messages for the specific room
  const loadMessages = async (roomName) => {
    try {
      const keptMess = await Conversation.find({ channel: roomName }).sort({ timeStamp: 1 }).exec();
      socket.emit('chat', keptMess); // Emit messages for the specific channel
    } catch (err) {
      console.log(err);
    }
  }

  // Load messages when a user connects
  socket.on("join room", (roomName, cb) => {
    socket.join(roomName);
    loadMessages(roomName); // Load messages for the specific room
    cb(allMessages[roomName]);
    socket.emit("joined", allMessages[roomName]);
  });

  // Emit new messages to all users
  socket.on('newMessage', async (msg) => {
    try {
      const newMessage = new Conversation(msg);
      await newMessage.save();
      io.emit('new message', msg); // Emit the message to all users
    } catch (err) {
      console.log(err);
    }
  });

  // Handle user joining the server
  socket.on("join server", (username) => {
    const user = {
      username,
      id: socket.id,
    };
    users.push(user);
    io.emit("new user", users); // Emit new user list to all users
  });

  // Handle sending messages to a specific room
  socket.on("send message", ({ content, to, sender, channel, isChannel }) => {
    const load = {
      content,
      channel,
      sender
    };
    if (isChannel) {
      socket.to(to).emit("new message", load); // Emit to the specific channel room
    } else {
      socket.to(to).emit("new message", load); // Emit to a user
    }

    if (allMessages[channel]) {
      allMessages[channel].push({
        sender,
        content
      });
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    users = users.filter(person => person.id !== socket.id);
    io.emit("new user", users); // Emit new user list after disconnection
    console.log("disconnect");
  });
});

// Start server on port 3002
server.listen("3002", () => {
  console.log("running on 3002 port");
});
