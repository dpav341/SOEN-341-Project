import React, { useEffect, useState } from "react";
import ChatLists from "./ChatLists";
import InputText from "./InputText";
import socketIOClient from "socket.io-client";

const ChatContainer = () => {
  const socketio = socketIOClient("http://localhost:3002");
  const [chats, setChats] = useState([]);

  useEffect(() => {
    socketio.on("chat", (chats) => {
      setChats(chats);
    });

    socketio.on('message', (msg) => {
      setChats((prevChats) => [...prevChats, msg])
    });

    return () => {
      socketio.off('chat');
      socketio.off('message');
    }
  }, []);

  const addMessage = (chat) => {
    const newChat = {
      username: localStorage.getItem("user"),
      message: chat,
      timestamp: new Date().toISOString() // ISO string format for the timestamp
    };
    socketio.emit('newMessage', newChat);
  };

  return (
    <div>
      <div className="home">
        <div className="chats_header">
          <h2>Chat Room</h2>
        </div>
        <ChatLists chats={chats} />
        <InputText addMessage={addMessage} />
      </div>
    </div>
  );
};

export default ChatContainer;

