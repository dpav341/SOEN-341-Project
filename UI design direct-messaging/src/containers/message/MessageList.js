import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux'; 
import io from 'socket.io-client';
import { messagesRequested, newMessageAdded } from '../../store/actions';
import Message from '../../components/message/Message';
import './MessageList.scss';

const socket = io("http://localhost:3002"); 

const MessageList = ({ conversationId, getMessagesForConversation, loadMessages }) => {
    const dispatch = useDispatch();  

    const messageDetails = getMessagesForConversation(conversationId);
    const messages = messageDetails ? messageDetails.messages : [];

    useEffect(() => {
        if (!messageDetails) {
            loadMessages(conversationId, null);
        }

       
        socket.on("message", (message) => {
            console.log("Received message:", message); 
            if (message.conversationId === conversationId) {
                dispatch(newMessageAdded(conversationId, message));  
            }
        });

        return () => {
            socket.off("message");  
        };
    }, [messageDetails, loadMessages, conversationId, dispatch]);

    return (
        <div id="chat-message-list">
            {messages.length > 0 ? messages.map((message, index) => (
                <Message key={index} isMyMessage={message.isMyMessage} message={message} />
            )) : <p>No messages yet</p>}
        </div>
    );
};

const mapStateToProps = state => ({
    getMessagesForConversation: conversationId => state.messagesState.messageDetails[conversationId]
});

const mapDispatchToProps = dispatch => ({
    loadMessages: (conversationId, lastMessageId) => dispatch(messagesRequested(conversationId, 5, lastMessageId))
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);


