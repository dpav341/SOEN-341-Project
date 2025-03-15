import React, { useState, useEffect } from "react";
import { create } from "zustand";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonSkiing, faMessage } from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";
import axios from "axios";
import "./Channels.css";

const socket = io("http://localhost:3002");

const userColors = {}; // Store user-color mappings

const getUserColor = (name) => {
  if (!userColors[name]) {
    // Generate a random color if not assigned yet
    userColors[name] = `hsl(${Math.random() * 360}, 80%, 60%)`;
  }
  return userColors[name];
};


const useChatStore = create((set) => ({
  channels: ["General", "tremblant", "saintAnne"],
  messages: {},
  joinChannel: (channel) => set((state) => ({
    messages: { ...state.messages, [channel]: state.messages[channel] || [] },
  })),
  addMessages: (channel, newMessages) => set((state) => ({
    messages: {
      ...state.messages,
      [channel]: [...(state.messages[channel] || []), ...newMessages],
    },
  })),
  addMessage: (channel, message) => set((state) => ({
    messages: {
      ...state.messages,
      [channel]: [...(state.messages[channel] || []), message],
    },
  })),
}));

export default function Channels() {
  const { channels, messages, joinChannel, addMessages, addMessage } = useChatStore();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("Baila");
  const [boss, setBoss] = useState(true);

  useEffect(() => {
    if (!selectedChannel) return;

    // Fetch previous messages from the API
    axios
      .get(`http://localhost:3002/Channels/${selectedChannel}`)
      .then((response) => {
        console.log("Fetched messages:", response.data);

        // Ensure messages are formatted correctly
        useChatStore.setState((state) => ({
          messages: {
            ...state.messages,
            [selectedChannel]: response.data.map(msg => ({
              sender: msg.name,  // ✅ Ensure correct key
              content: msg.text,  // ✅ Ensure correct key
            })),
          },
        }));
      })
      .catch((error) => console.error("Error loading messages:", error));

    // Join the socket channel
    socket.emit("join room", selectedChannel, (prevMessages) => {
      console.log("Socket previous messages:", prevMessages);

      useChatStore.setState((state) => ({
        messages: {
          ...state.messages,
          [selectedChannel]: (prevMessages || []).map(msg => ({
            sender: msg.name,
            content: msg.text,
          })),
        },
      }));
    });

    // Listen for new messages
    const messageListener = (message) => {
      console.log("New message received:", message);

      if (message.channel === selectedChannel) {
        useChatStore.setState((state) => {
          const existingMessages = state.messages[selectedChannel] || [];

          // Prevent duplicate messages
          if (!existingMessages.some(msg => msg.content === message.text && msg.sender === message.name)) {
            return {
              messages: {
                ...state.messages,
                [selectedChannel]: [
                  ...existingMessages,
                  { sender: message.name, content: message.text },
                ],
              },
            };
          }
          return state; // No changes if duplicate
        });
      }
    };


    socket.on("new message", messageListener);

    return () => {
      socket.off("new message", messageListener);
    };
  }, [selectedChannel]);


  const handleSendMessage = () => {
    if (selectedChannel && newMessage.trim()) {
      const messageData = {
        text: newMessage,
        channel: selectedChannel,
        name: username,
        time: new Date(),
      };

      // Emit message but don't add it to store immediately
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
                  <span className="username" style={{ color: getUserColor(msg.sender) }}>
                    {msg.sender}
                  </span>
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