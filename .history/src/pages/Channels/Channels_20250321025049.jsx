import React, { useState, useEffect } from "react";
import { create } from "zustand";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonSkiing, faMessage, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";
import axios from "axios";
import "./Channels.css";
import Picker from 'emoji-picker-react';
import data from 'emoji-picker-react'
import { Emoji, EmojiStyle } from 'emoji-picker-react';



const socket = io("http://localhost:3002");

const userColors = {};
const getUserColor = (name) => {
  if (!userColors[name]) {
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
  deleteMessage: (channel, index) => set((state) => ({
    messages: {
      ...state.messages,
      [channel]: state.messages[channel].filter((_, i) => i !== index),
    },
  })),
  addChannel: (channelName) => set((state) => ({
    channels: [...state.channels, channelName],
    messages: { ...state.messages, [channelName]: [] },
  })),
  deleteChannel: (channelName) => set((state) => {
    const updatedMessages = { ...state.messages };
    delete updatedMessages[channelName];
    return {
      channels: state.channels.filter((channel) => channel !== channelName),
      messages: updatedMessages,
    };
  }),
}));

export default function Channels() {
  const { channels, messages, joinChannel, addMessages, addMessage, deleteMessage, addChannel, deleteChannel } = useChatStore();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [newChannel, setNewChannel] = useState("");
  const [username, setUsername] = useState("Baila");
  const [boss, setBoss] = useState(true); // Admin flag
  const [emoji, setEmoji] = useState(null)
  const [reactOn, setReactOn] = useState(false)


  useEffect(() => {
    if (!selectedChannel) return;

    axios.get(`http://localhost:3002/Channels/${selectedChannel}`)
      .then((response) => {
        useChatStore.setState((state) => ({
          messages: {
            ...state.messages,
            [selectedChannel]: response.data.map(msg => ({
              sender: msg.name,
              content: msg.text,
            })),
          },
        }));
      })
      .catch((error) => console.error("Error loading messages:", error));

    socket.emit("join room", selectedChannel, (prevMessages) => {
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

    const messageListener = (message) => {
      if (message.channel === selectedChannel) {
        useChatStore.setState((state) => {
          const existingMessages = state.messages[selectedChannel] || [];
          if (!existingMessages.some(msg => msg.content === message.text && msg.sender === message.name)) {
            return {
              messages: {
                ...state.messages,
                [selectedChannel]: [...existingMessages, { sender: message.name, content: message.text }],
              },
            };
          }
          return state;
        });
      }
    };

    const handleReaction = (emoji, index) => {
      addReaction(selectedChannel, index, emoji);
      setReactOn(false);
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

      socket.emit("newMessage", messageData);
      setNewMessage("");
    }
  };

  const handleDeleteMessage = (index) => {
    if (boss || messages[selectedChannel][index].sender === username) {
      deleteMessage(selectedChannel, index);
      socket.emit("deleteMessage", { channel: selectedChannel, index });
    }
  };

  const handleAddChannel = () => {
    if (boss && newChannel.trim() && !channels.includes(newChannel)) {
      addChannel(newChannel);
      setNewChannel("");
    }
  };

  const handleDeleteChannel = (channel) => {
    if (boss) {
      deleteChannel(channel);
      socket.emit("deleteChannel", { channel });
      if (selectedChannel === channel) setSelectedChannel(null);
    }
  };

  return (
    <div className="chat-app">
      <div className="sidebar">
        <h1>SkiGo</h1>

        {channels.map((channel) => (
          <div key={channel} className="channel-item">
            <button
              onClick={() => {
                setSelectedChannel(channel);
                joinChannel(channel);
              }}
              className={`channel-button ${selectedChannel === channel ? "active" : ""}`}
            >
              {channel}
              {boss && (
                <button className="delete-channel" onClick={() => handleDeleteChannel(channel)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </button>
          </div>
        ))}

        {boss && (
          <div className="channel-management">
            <input
              value={newChannel}
              onChange={(e) => setNewChannel(e.target.value)}
              placeholder="New channel name"
              className="channel-input"
            />
            <button onClick={handleAddChannel} className="add-channel">
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        )}

        <button className="messLink">
          <FontAwesomeIcon className="chgMess" icon={faMessage} />
        </button>
      </div>

      <div className="chat-container">
        {selectedChannel ? (
          <>
            <div className="chat-header">{selectedChannel}</div>
            <div className="chat-messages">
              {messages[selectedChannel]?.map((msg, idx) => (
                <div key={idx} className={`message ${msg.sender === username ? "my-message" : "other-message"}`}>
                  <button onClick={() => setReactOn(reactOn)} className="add-channel">
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                  <div className={reactOn ? 'd-block' : 'd-none'}>
                    <Picker
                      onEmojiClick={(emojiObject) => handleReaction(emojiObject.emoji)}
                    />

                  </div>
                  <span className="username" style={{ color: getUserColor(msg.sender) }}>
                    {msg.sender}
                  </span>
                  <p className="message-text">{msg.content}</p>
                  {(boss || msg.sender === username) && (
                    <button className="delete-message" onClick={() => handleDeleteMessage(idx)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
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