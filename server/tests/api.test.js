import { io as Client } from "socket.io-client";
import { expressServer } from "../index.js";

let clientSocket1, clientSocket2;

beforeEach(async () => {
    clientSocket1 = new Client("http://localhost:3002");
    clientSocket2 = new Client("http://localhost:3002");
    await Promise.all([
        new Promise((resolve) => clientSocket1.on("connect", resolve)),
        new Promise((resolve) => clientSocket2.on("connect", resolve)),
    ]);
});

afterEach(() => {
    if (clientSocket1.connected) {
        clientSocket1.disconnect();
    }
    if (clientSocket2.connected) {
        clientSocket2.disconnect();
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
        expect(clientSocket1.connected).toBe(true);
        expect(clientSocket2.connected).toBe(true);
    });

    test("should emit and receive a 'newMessage' event", (done) => {
        const testMessage = { name: "User2", text: "New Message" };

        clientSocket1.emit("newMessage", testMessage);

        clientSocket1.on("message", (msg) => {
            expect(msg).toEqual(expect.objectContaining(testMessage));
            done();
        });
    });

    test("should handle 'enterRoom' event and emit 'messageList'", (done) => {
        const testRoom = { name: "User3", room: "TestRoom" };

        clientSocket1.emit("enterRoom", testRoom);

        clientSocket1.on("messageList", (messages) => {
            expect(messages).toEqual([]);
            done();
        });
    });

    test("should handle 'disconnect' event", (done) => {
        clientSocket1.on("disconnect", () => {
            expect(clientSocket1.connected).toBe(false);
            done();
        });

        clientSocket1.disconnect();
    });

    test("should send the list of users inside a room", (done) => {
        const testRoom = { name: "User1", room: "TestRoom" };

        clientSocket1.emit("enterRoom", testRoom);

        clientSocket1.on("userList", (data) => {
            expect(data).toEqual({
                users: expect.arrayContaining([
                    expect.objectContaining({ name: "User1", room: "TestRoom" }),
                ]),
            });
            done();
        });
    });

    test("should send the updated user list when someone leaves the room", (done) => {
        let count = 0;
        const testRoom1 = { name: "User1", room: "TestRoom" };
        const testRoom2 = { name: "User2", room: "TestRoom" };

        clientSocket1.emit("enterRoom", testRoom1);
        clientSocket2.emit("enterRoom", testRoom2);

        clientSocket1.on("userList", (data) => {
            expect(data).toEqual({
                users: expect.arrayContaining([
                    expect.objectContaining({ name: "User1", room: "TestRoom" }),
                ]),
            });
            expect(data.users).not.toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: "User2", room: "TestRoom" }),
                ])
            );
            count++;
            if (count >= 1)
                done();
        });

        clientSocket2.emit("enterRoom", {
            name: "User2",
            room: "anotherRoom",
        });
    });
});
