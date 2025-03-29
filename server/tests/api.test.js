import { io as Client } from "socket.io-client";
import { Server } from "socket.io";
import http from "http";
import { Conversation } from "../message.js";
import express from "express";

// Mock database connection
jest.mock("../db.js", () => ({
    Connection: jest.fn(),
}));

jest.mock("../message.js", () => ({
    Conversation: {
        find: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([]), // Mock empty message history
        }),
    },
}));

let server, io, clientSocket;

beforeAll((done) => {
    const app = express();
    server = http.createServer(app);
    io = new Server(server);
    server.listen(3002, () => {
        console.log("Test server started on port 3002");
        done();
    });

    io.on("connection", (socket) => {
        console.log(`User ${socket.id} connected`);

        socket.on("message", (msg) => {
            io.emit("message", msg);
        });

        socket.on("newMessage", (msg) => {
            io.emit("message", msg);
        });

        socket.on("enterRoom", ({ name, room }) => {
            socket.join(room);
            io.to(room).emit("messageList", []);
        });

        socket.on("disconnect", () => {
            console.log(`User ${socket.id} disconnected`);
        });
    });
});

beforeEach((done) => {
    clientSocket = new Client("http://localhost:3002");
    clientSocket.on("connect", done);
});

afterEach(() => {
    if (clientSocket.connected) {
        clientSocket.disconnect();
    }
});

afterAll((done) => {
    io.close();
    server.close(() => {
        console.log("Test server closed.");
        done();
    });
});

describe("Socket.IO Server", () => {
    test("should establish a socket connection", (done) => {
        expect(clientSocket.connected).toBe(true);
        done();
    });

    test("should emit and receive a 'message' event", (done) => {
        const testMessage = { name: "User1", text: "Hello World" };

        clientSocket.emit("message", testMessage);

        clientSocket.on("message", (msg) => {
            expect(msg).toEqual(expect.objectContaining(testMessage));
            done();
        });
    });

    test("should emit and receive a 'newMessage' event", (done) => {
        const testMessage = { name: "User2", text: "New Message" };

        clientSocket.emit("newMessage", testMessage);

        clientSocket.on("message", (msg) => {
            expect(msg).toEqual(expect.objectContaining(testMessage));
            done();
        });
    });

    test("should handle 'enterRoom' event and emit 'messageList'", (done) => {
        const testRoom = { name: "User3", room: "TestRoom" };

        jest.spyOn(Conversation, "find").mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([{ text: "Test message" }]),
        });

        clientSocket.emit("enterRoom", testRoom);

        clientSocket.on("messageList", (messages) => {
            expect(messages).toEqual([]);
            done();
        });
    });

    test("should handle 'disconnect' event", (done) => {
        clientSocket.on("disconnect", () => {
            expect(clientSocket.connected).toBe(false);
            done();
        });

        clientSocket.disconnect();
    });
});
