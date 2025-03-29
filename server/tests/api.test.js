import { io as Client } from "socket.io-client";
import { expressServer } from "../index.js";

let clientSocket;

beforeEach(async () => {
    clientSocket = new Client("http://localhost:3002");
    await new Promise((resolve) => {
        clientSocket.on("connect", resolve);
    });
});

afterEach(() => {
    if (clientSocket.connected) {
        clientSocket.disconnect();
    }
});

afterAll((done) => {
    expressServer.close(() => {
        console.log("Test server closed.");
        done();
    });
});

describe("Socket.IO Server", () => {
    test("should establish a socket connection", async () => {
        expect(clientSocket.connected).toBe(true);
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

    test("should send the list of users inside a room", (done) => {
        const testRoom = { name: "User1", room: "TestRoom" };

        clientSocket.emit("enterRoom", testRoom);

        clientSocket.on("userList", (data) => {
            expect(data).toEqual({
                users: expect.arrayContaining([
                    expect.objectContaining({ name: "User1", room: "TestRoom" }),
                ]),
            });
            done();
        });
    });
});
