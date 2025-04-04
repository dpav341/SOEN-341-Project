import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './ChatApp.css';

const socket = io('ws://localhost:3500');

const ChatApp = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('messageList', (data) => {
      setMessages(data);
    });

    socket.on('userList', ({ users }) => {
      setUsers(users);
    });

    socket.on('roomList', ({ rooms }) => {
      setRooms(rooms);
    });

    return () => {
      socket.off('message');
      socket.off('messageList');
      socket.off('userList');
      socket.off('roomList');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (name && message) {
      socket.emit('message', { name, text: message });
      setMessage('');
    }
  };

  const enterRoom = (e) => {
    e.preventDefault();
    if (name && room) {
      socket.emit('enterRoom', { name, room });
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-main">
        <form onSubmit={enterRoom} className="form-join">
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="text" placeholder="Room" value={room} onChange={(e) => setRoom(e.target.value)} required />
          <button type="submit">Join Room</button>
        </form>
        <div className="chat-display">
          {messages.map((msg, i) => (
            <div key={i} className={`post ${msg.name === name ? 'post--left' : 'post--right'}`}>
              <div className="post__header">
                <span className="post__header--name">{msg.name}</span>
                <span className="post__header--time">{msg.time}</span>
              </div>
              <div className="post__text">{msg.text}</div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="form-msg">
          <input type="text" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} required />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatApp;
