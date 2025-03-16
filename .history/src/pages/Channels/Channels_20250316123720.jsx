
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3002"); // Updated WebSocket server URL

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [channel, setChannel] = useState("general"); // Default channel

  useEffect(() => {
    socket.emit("joinChannel", channel);

    socket.on("receiveMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.emit("leaveChannel", channel);
    };
  }, [channel]);

  const sendMessage = () => {
    if (input.trim()) {
      const messageData = { channel, text: input, sender: "User" };
      socket.emit("sendMessage", messageData);
      setMessages((prev) => [...prev, messageData]);
      setInput("");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Chat App</h2>
      <div className="mb-2">
        <label className="block">Select Channel:</label>
        <select
          className="border p-2"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        >
          <option value="general">General</option>
          <option value="sports">tremblant</option>
          <option value="tech">saintAnne</option>
        </select>
      </div>
      <div className="border p-4 h-64 overflow-auto">
        {messages.map((msg, index) => (
          <div key={index} className="p-1 border-b">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-2 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 flex-1"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 ml-2">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatApp;