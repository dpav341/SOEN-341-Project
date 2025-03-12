import React, { useEffect, useRef } from 'react';

const ChatLists = ({ chats }) => {
    const endOfMessages = useRef();
    const user = localStorage.getItem('user');

    function SenderChat({ message, username, timestamp }) {
        return (
          <div className='chat_sender'>
            <p>
              <strong>{username}</strong> <br/>
              {message}
            </p>
            <span className='chat_timestamp'>{new Date(timestamp).toLocaleTimeString()}</span>
          </div>
        );
      }
      
      function ReceiverChat({ message, username, timestamp }) {
        return (
          <div className='chat_receiver'>
            <p>
              <strong>{username}</strong> <br/>
              {message}
            </p>
            <span className='chat_timestamp'>{new Date(timestamp).toLocaleTimeString()}</span>
          </div>
        );
      }

      chats.map((chat, index) => {
        if (chat.username === user) {
          return <SenderChat 
                  key={index}
                  message={chat.message}
                  username={chat.username}
                  timestamp={chat.timestamp}
                 />;
        } else {
          return <ReceiverChat 
                  key={index}
                  message={chat.message}
                  username={chat.username}
                  timestamp={chat.timestamp}
                 />;
        }
      })
      
    
    useEffect(() => {
        scrollToBottom();
    }, [chats]);

    const scrollToBottom = () => {
        endOfMessages.current?.scrollIntoView({behavior: "smooth"});
    };

    return (
        <div className='chats_list'>
            {
                chats.map((chat, index) => {
                    if (chat.username === user) {
                        return <SenderChat 
                                key={index}
                                message={chat.message}
                                username={chat.username}
                               />;
                    } else {
                        return <ReceiverChat 
                                key={index}
                                message={chat.message}
                                username={chat.username}
                               />;
                    }
                })
            }
            <div ref={endOfMessages}></div>
        </div>
    );
};

export default ChatLists;
