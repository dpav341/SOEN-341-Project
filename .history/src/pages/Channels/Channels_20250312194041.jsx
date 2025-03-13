import React, { useState, useEffect } from "react";
import { create } from "zustand";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonSkiing, faMessage } from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";
import axios from "axios";
import "./Channels.css";

const socket = io("http://localhost:3002");

useChatStore.setState((state) => ({
  messages: {
    ...state.messages,
    [selectedChannel]: response.data.map(msg => ({
      sender: msg.name,  // Ensure correct key
      content: msg.text,  // Ensure correct key
    })),
  },
}));

export default function Channels() {
  const { channels, messages, joinChannel, addMessages, addMessage } = useChatStore();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("Baila");

  useEffect(() => {
    if (!selectedChannel) return;

    // Fetch previous messages from the API
    axios
      .get(`http://localhost:3002/Channels/${selectedChannel}`)
      .then((response) => {
        console.log("Fetched messages:", response.data);
        addMessages(selectedChannel, response.data);
      })
      .catch((error) => console.error("Error loading messages:", error));

    // Join the socket channel
    socket.emit("join room", selectedChannel, (prevMessages) => {
      console.log("Socket previous messages:", prevMessages);
      addMessages(selectedChannel, prevMessages || []);
    });

    // Listen for new messages
    const messageListener = (message) => {
      console.log("New message received:", message);
      if (message.channel === selectedChannel) {
        addMessage(selectedChannel, {
          sender: message.name,
          content: message.text,
        });
      }
    };

    socket.on("new message", messageListener);

    return () => {
      socket.off("new message", messageListener);
    };
  }, [selectedChannel, addMessages, addMessage]);

  const handleSendMessage = () => {
    if (selectedChannel && newMessage.trim()) {
      const messageData = {
        text: newMessage,
        channel: selectedChannel,
        name: username,
        time: new Date(),
      };

      addMessage(selectedChannel, {
        sender: username,
        content: newMessage,
      });

      socket.emit("newMessage", messageData);
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
              joinChannel(channel);
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
                <div
                  key={idx}
                  className={`message ${msg.sender === username ? "my-message" : "other-message"}`}
                >
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