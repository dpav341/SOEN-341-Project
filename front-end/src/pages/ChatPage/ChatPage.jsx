import React, { useEffect, useRef, useState } from 'react';
//import io from 'socket.io-client';
import { io as socketIOClient } from "socket.io-client";
import './ChatPage.css';

//const socket = io('ws://localhost:3002');
const socket = socketIOClient(
  process.env.NODE_ENV === 'production'
    ? undefined  // use same origin as frontend
    : "http://localhost:3002"
);

function Message({ name, text, time, isUser }) {
  return (
    <li className={`post ${isUser ? 'post--left' : 'post--right'}`}>
      <div className={`post__header ${isUser ? 'post__header--user' : 'post__header--reply'}`}>
        <span className="post__header--name">{name}</span>
        <span className="post__header--time">{time}</span>
      </div>
      <div className="post__text">{text}</div>
    </li>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const nameRef = useRef(null);
  const roomRef = useRef(null);
  const msgRef = useRef(null);
  const chatDisplayRef = useRef(null);
  const activityRef = useRef(null);

  useEffect(() => {
    socket.on('message', (data) => {
      activityRef.current.textContent = '';
      setMessages((prevMessages) => [...prevMessages, data]);
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    });

    socket.on('messageList', (data) => {
      activityRef.current.textContent = '';
      setMessages(data);
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    });

    return () => {
      socket.off('message');
      socket.off('messageList');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (nameRef.current.value && msgRef.current.value && roomRef.current.value) {
      socket.emit('message', {
        name: nameRef.current.value,
        text: msgRef.current.value,
        room: roomRef.current.value,
      });
      msgRef.current.value = '';
    }
    msgRef.current.focus();
  };

  const enterRoom = (e) => {
    e.preventDefault();
    if (nameRef.current.value && roomRef.current.value) {
      socket.emit('enterRoom', {
        name: nameRef.current.value,
        room: roomRef.current.value,
      });
    }
  };

  return (
    <main>
      <form className="form-join" onSubmit={enterRoom}>
        <input type="text" id="name" ref={nameRef} maxLength="8" placeholder="Your name" size="5" required />
        <input type="text" id="room" ref={roomRef} placeholder="Chat room" size="5" required />
        <button id="join" type="submit">Join</button>
      </form>

      <ul className="chat-display" ref={chatDisplayRef}>
        {messages.map((msg, index) => (
          <Message
            key={index}
            name={msg.name}
            text={msg.text}
            time={msg.time}
            isUser={msg.name === nameRef.current.value}
          />
        ))}
      </ul>

      <p className="user-list"></p>

      <p className="room-list"></p>

      <p className="activity" ref={activityRef}></p>

      <form className="form-msg" onSubmit={sendMessage}>
        <input type="text" id="message" ref={msgRef} placeholder="Your message" required />
        <button type="submit">Send</button>
      </form>
    </main>
  );
}
