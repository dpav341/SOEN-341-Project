import express from 'express'
import { Server } from "socket.io"
import path from 'path'
import { fileURLToPath } from 'url'
import { Connection } from './db.js'
import { getChannelCollection, getDMCollection, saveMessage } from './message.js'

import { deleteMessage } from './message.js';


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3500
const ADMIN = "Admin"

const app = express()

app.use(express.static(path.join(__dirname, "public")))

const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

Connection();

// state 
const UsersState = {
    users: [],
    setUsers: function (newUsersArray) {
        this.users = newUsersArray
    }
}

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
})

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`)

    // Handle message deletion
    socket.on('deleteMessage', async ({ id }) => {
        const user = getUser(socket.id);
        if (user && user.name === ADMIN) { // Only Admin can delete
            await deleteMessage(user.room, id);
            io.to(user.room).emit('messageDeleted', { id });
        }
    });

    socket.on('enterRoom', ({ name, room }) => {

        // leave previous room 
        const prevRoom = getUser(socket.id)?.room
        if (prevRoom) {
            socket.leave(prevRoom)
        }

        const user = activateUser(socket.id, name, room)

        // Cannot update previous room users list until after the state update in activate user 
        if (prevRoom) {
            io.to(prevRoom).emit('userList', {
                users: getUsersInRoom(prevRoom)
            })
        }

        // join room 
        socket.join(user.room)

        // To user who joined 
        if (user.room !== "Tremblant" && user.room !== "Sutton") {
            socket.emit('message', buildMsg(ADMIN, `You are chatting with ${user.room}`))
        }
        else {
            socket.emit('message', buildMsg(ADMIN, `You have joined the ${user.room} chat room`))
        }

        const loadMessageList = async (name, room) => {
            try {
                if (room !== "Tremblant" && room !== "Sutton") {
                    const dmChat = getDMCollection(name, room);
                    const messageList = await dmChat.find().sort({ timeStamp: 1 }).toArray();
                    socket.emit('messageList', messageList);
                }
                else {
                    const channelChat = getChannelCollection(room);
                    const messageList = await channelChat.find().sort({ timeStamp: 1 }).toArray();
                    socket.emit('messageList', messageList);
                }
            } catch (err) {
                console.error(err);
            }
        };

        loadMessageList(name, user.room);

        // Update user list for room 
        io.to(user.room).emit('userList', {
            users: getUsersInRoom(user.room)
        })

        // Update rooms list for everyone 
        io.emit('roomList', {
            rooms: getAllActiveRooms()
        })

    })

    // When user disconnects - to all others 
    socket.on('disconnect', () => {
        const user = getUser(socket.id)
        userLeavesApp(socket.id)

        if (user) {
            io.to(user.room).emit('userList', {
                users: getUsersInRoom(user.room)
            })
            io.emit('roomList', {
                rooms: getAllActiveRooms()
            })
        }

        console.log(`User ${socket.id} disconnected`)
    })

    // Listening for a message event 
    socket.on('message', ({ name, text }) => {
        const room = getUser(socket.id)?.room
        if (room) {
            io.to(room).emit('message', buildMsg(name, text))
            saveMessage(room, name, text);
            io.to(name).emit('message', buildMsg(name, text))
        }
    })
})

function buildMsg(name, text) {
    return {
        name,
        text,
        time: new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(new Date())
    }
}


// User functions 
function activateUser(id, name, room) {
    const user = { id, name, room }
    UsersState.setUsers([
        ...UsersState.users.filter(user => user.id !== id),
        user
    ])
    return user
}

function userLeavesApp(id) {
    UsersState.setUsers(
        UsersState.users.filter(user => user.id !== id)
    )
}

function getUser(id) {
    return UsersState.users.find(user => user.id === id)
}

function getUsersInRoom(room) {
    return UsersState.users.filter(user => user.room === room)
}

function getAllActiveRooms() {
    return Array.from(new Set(UsersState.users.map(user => user.room)))
}
