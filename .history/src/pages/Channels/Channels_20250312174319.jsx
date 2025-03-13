import React, { useState, useEffect } from "react";
import { create } from "zustand";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonSkiing, faMessage } from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";
import axios from "axios";
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
    if (selectedChannel) {
      // Fetch past messages from MongoDB when a channel is selected
      axios.get(`http://localhost:3002/messages/${selectedChannel}`)
        .then((response) => {
          console.log("Loaded messages from MongoDB:", response.data); // Debugging
          useChatStore.setState({ messages: { ...messages, [selectedChannel]: response.data } });
        })
        .catch((error) => {
          console.error("Error loading messages:", error);
        });

      // Join the room in Socket.io
      socket.emit("join room", selectedChannel, (prevMessages) => {
        console.log("Socket.io previous messages:", prevMessages); // Debugging
        prevMessages.forEach((msg) => addMessage(msg.channel, msg)); // Populate messages
      });
    }
  }, [selectedChannel, addMessage]); // Re-run when channel changes

  const handleSendMessage = () => {
    if (selectedChannel && newMessage.trim()) {
      const messageData = {
        content: newMessage,
        channel: selectedChannel,  // Correct field name (not `chatName`)
        sender: username,
        isChannel: true,
      };

      socket.emit("newMessage", messageData); // Emit message to server
      addMessage(selectedChannel, messageData); // Add to local state immediately
      setNewMessage("");
    }
  };
  useEffect(() => {
    socket.on("new message", (message) => {
      console.log("Received new message:", message); // Debugging
      if (message.channel === selectedChannel) { // Ensure it belongs to the current channel
        addMessage(message.channel, message);
      }
    });

    return () => {
      socket.off("new message");
    };
  }, [selectedChannel, addMessage]);


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
