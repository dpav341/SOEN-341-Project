import React, { useState, useEffect } from "react";
import { create } from "zustand";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonSkiing, faMessage } from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";
import "./Channels.css";

const socket = io("http://localhost:3002");

const useChatStore = create((set) => ({
  channels: ["general", "tremblant", "saintAnne"],
  messages: {},
  joinChannel: (channel) => set((state) => ({
    messages: { ...state.messages, [channel]: state.messages[channel] || [] }
  })),
  addMessage: (channel, message) => set((state) => ({
    messages: {
      ...state.messages,
      [channel]: [...(state.messages[channel] || []), message]
    }
  }))
}));

export default function Channels() {
  const { channels, messages, joinChannel, addMessage } = useChatStore();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("Baila");

  // Listen to "new message" event for new messages
  useEffect(() => {
    socket.on("new message", (message) => {
      console.log("Received new message: ", message); // Debugging
      addMessage(message.chatName, message);
    });

    // Listen to "chat" event to load previous messages when joining a channel
    socket.on("chat", (messages) => {
      console.log("Received chat messages: ", messages); // Debugging
      messages.forEach((msg) => addMessage(msg.channel, msg)); // Load previous messages
    });

    // Clean up the listeners when component unmounts
    return () => {
      socket.off("new message");
      socket.off("chat");
    };
  }, [addMessage]);

  const handleSendMessage = () => {
    if (selectedChannel && newMessage.trim()) {
      const messageData = {
        content: newMessage,
        chatName: selectedChannel,  // Use chatName for channel
        sender: username,
        isChannel: true,
      };
      socket.emit("send message", messageData); // Emit message to server
      setNewMessage("");
    }
  };

  return (
    <div className="chat-app">
      <div className="sidebar">
        <h1>SkiGo</h1>
        {channels.map((channel) => (
          <button
            key={channel}
            onClick={() => {
              setSelectedChannel(channel);
              joinChannel(channel); // Join channel in store
              socket.emit("join room", channel, (prevMessages) => {
                prevMessages.forEach((msg) => addMessage(msg.chatName, msg)); // Populate messages from server
              });
            }}
            className={`channel-button ${selectedChannel === channel ? "active" : ""}`}
          >
            {channel}
          </button>
        ))}
        <button className='messLink'>
          <FontAwesomeIcon className="chgMess" icon={faMessage} />
        </button>
      </div>
      <div className="chat-container">
        {selectedChannel ? (
          <>
            <div className="chat-header">{selectedChannel}</div>
            <div className="chat-messages">
              {messages[selectedChannel]?.map((msg, idx) => (
                <div key={idx} className="message">
                  <span className="username">{msg.sender}</span>
                  <p className="message-text">{msg.content}</p>
                </div>
              ))}
            </div>
            <div className="chat-input-container">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="chat-input"
              />
              <button onClick={handleSendMessage} className="send-button">Send</button>
            </div>
          </>
        ) : (
          <div className="iddle">
            <FontAwesomeIcon icon={faPersonSkiing} />
            <div className="placeholder">Select a channel to start skiing</div>
          </div>
        )}
      </div>
    </div>
  );
}
