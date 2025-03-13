import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Connection } from './db.js';
import mongoose from 'mongoose';
import { Conversation } from './message.js';

const app = express();
app.use(express.json());
Connection(); // Connect to MongoDB

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

let users = [];
const allMessages = {
  general: [],
  tremblant: [],
  saintAnne: [],
};

// Function to load messages from MongoDB for a room
const loadMessages = async (roomName) => {
  try {
    return await Conversation.find({ channel: roomName }).sort({ timeStamp: 1 }).exec();
  } catch (err) {
    console.log("Error loading messages:", err);
    return [];
  }
};

// API endpoint for frontend to fetch messages
app.get("/Channels/:roomName", async (req, res) => {
  const { channel } = req.params;  // ✅ Now consistent
  console.log(`Fetching messages for room: ${channel}`);

  try {
    const messages = await Conversation.find({ channel: channel }).sort({ timeStamp: 1 }).exec();

    // Format messages correctly
    const formattedMessages = messages.map(msg => ({
      sender: msg.sender,
      content: msg.content,
      timeStamp: msg.timeStamp,
    }));

    console.log("Formatted Messages:", formattedMessages);
    res.json(formattedMessages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});








// Handle socket connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // User joins a room and loads messages
  socket.on("join room", async (roomName, cb) => {
    socket.join(roomName);
    console.log(`User ${socket.id} joined room: ${roomName}`);

    const messages = await loadMessages(roomName);
    cb(messages); // Send past messages to the user
    io.to(roomName).emit("joined", messages); // Broadcast past messages to the room
  });

  // Emit new messages to all users & store in DB
  socket.on('newMessage', async (msg) => {
    try {
      console.log(`Broadcasting to room: ${msg.channel}`);
      console.log(`Available rooms:`, io.sockets.adapter.rooms);

      const newMessage = new Conversation(msg);
      await newMessage.save();

      io.to(msg.channel).emit('new message', msg);
    } catch (err) {
      console.log(err);
    }
  });


  // Handle user joining the server
  socket.on("join server", (username) => {
    const user = { username, id: socket.id };
    users.push(user);
    io.emit("new user", users);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    users = users.filter(person => person.id !== socket.id);
    io.emit("new user", users);
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(3002, () => {
  console.log("Server running on port 3002");
});

// Default route to check if the server is running
app.get("/", (req, res) => {
  res.send("Socket.io Chat Server is Running!");
});
