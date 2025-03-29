import { Server } from "socket.io";
import { createServer } from "http";
import { io as Client } from "socket.io-client";
import express from "express";

jest.setTimeout(10000);

describe("Socket.IO Server", () => {
    let io, serverSocket, clientSocket, httpServer;

    beforeAll((done) => {
        // Create an HTTP server and attach the Socket.IO server
        const app = express()
        httpServer = createServer(app);
        io = new Server(httpServer);
        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = Client(`http://localhost:${port}`);
            io.on("connection", (socket) => {
                serverSocket = socket;
            });
            clientSocket.on("connect", done);
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
        httpServer.close();
    });

    test("should establish a socket connection", (done) => {
        clientSocket.on("connect", () => {
            try {
                expect(clientSocket.connected).toBe(true);
                done();
            } catch (error) {
                done(error); // Call done with the error to fail the test
            }
        });

        clientSocket.on("connect_error", (error) => {
            console.error("Connection error:", error); // Debugging log for connection errors
            done(error); // Fail the test if there's a connection error
        });
    });

    test("should emit and receive a 'message' event", (done) => {
        const testMessage = { name: "TestUser", text: "Hello, world!" };

        clientSocket.emit("message", testMessage);

        serverSocket.on("message", (msg) => {
            expect(msg).toEqual(testMessage);
            done();
        });
    });

    test("should emit and receive a 'newMessage' event", (done) => {
        const newMessage = { name: "TestUser", text: "New message content" };

        clientSocket.emit("newMessage", newMessage);

        serverSocket.on("newMessage", (msg) => {
            expect(msg).toEqual(newMessage);
            done();
        });
    });

    test("should handle 'enterRoom' event and emit 'messageList'", (done) => {
        const roomData = { name: "TestUser", room: "TestRoom" };

        clientSocket.emit("enterRoom", roomData);

        serverSocket.on("enterRoom", (data) => {
            expect(data).toEqual(roomData);
            serverSocket.emit("messageList", [{ text: "Welcome to the room!" }]);
        });

        clientSocket.on("messageList", (messages) => {
            expect(messages).toEqual([{ text: "Welcome to the room!" }]);
            done();
        });
    });

    test("should handle 'disconnect' event", (done) => {
        clientSocket.on("disconnect", () => {
            expect(clientSocket.connected).toBe(false);
            done();
        });

        clientSocket.close();
    });
});