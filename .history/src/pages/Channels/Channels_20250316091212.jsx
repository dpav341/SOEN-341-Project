
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './ChatApp.css';

const socket = io('ws://localhost:3500');

const ChatApp = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activity, setActivity] = useState('');
  const chatDisplayRef = useRef(null);

  useEffect(() => {
    socket.on('message', (data) => {
      setActivity('');
      setMessages(prevMessages => [...prevMessages, data]);
    });

    socket.on('messageList', (data) => {
      setActivity('');
      setMessages(data);
    });

    return () => {
      socket.off('message');
      socket.off('messageList');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (name && message && room) {
      socket.emit('message', { name, text: message, room });
      setMessage('');
    }
  };

  const enterRoom = (e) => {
    e.preventDefault();
    if (name && room) {
      socket.emit('enterRoom', { name, room });
    }
  };

  const handleTyping = () => {
    socket.emit('activity', name);
  };

  useEffect(() => {
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <form className="form-join" onSubmit={enterRoom}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Room" value={room} onChange={(e) => setRoom(e.target.value)} required />
        <button type="submit">Join Room</button>
      </form>
      <div className="chat-display" ref={chatDisplayRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`post ${msg.name === name ? 'post--left' : msg.name !== 'Admin' ? 'post--right' : ''}`}>
            {msg.name !== 'Admin' ? (
              <>
                <div className={`post__header ${msg.name === name ? 'post__header--user' : 'post__header--reply'}`}>
                  <span className="post__header--name">{msg.name}</span>
                  <span className="post__header--time">{msg.time}</span>
                </div>
                <div className="post__text">{msg.text}</div>
              </>
            ) : (
              <div className="post__text">{msg.text}</div>
            )}
          </div>
        ))}
      </div>
      <p className="activity">{activity}</p>
      <form className="form-msg" onSubmit={sendMessage}>
        <input type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={handleTyping} required />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatApp;
