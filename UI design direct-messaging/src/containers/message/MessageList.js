import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import socketIOClient from "socket.io-client";
import { messagesRequested, newMessageAdded } from '../../store/actions';
import Message from '../../components/message/Message';
import './MessageList.scss';

const socket = io("http://localhost:3002"); 

const MessageList = ({ conversationId, getMessagesForConversation, loadMessages }) => {
    const messageDetails = getMessagesForConversation(conversationId);
    const messages = messageDetails ? messageDetails.messages: null;
    let messageItems = null;

    useEffect(() => {
        if (!messageDetails) {
            loadMessages(conversationId, null);
        }
    }, [messageDetails, loadMessages, conversationId])

    if (messages && messages.length > 0) {
        messageItems = messages.map((message, index) => {
            return <Message 
                key={index}
                isMyMessage={message.isMyMessage}
                message={message} />;
        });
    }

    return (
        <div id="chat-message-list">
            {messageItems}
        </div>
    );
}

const mapStateToProps = state => {
    const getMessagesForConversation = conversationId => {
        return state.messagesState.messageDetails[conversationId];
    }

    return {
        getMessagesForConversation
    }
}

const mapDispatchToProps = dispatch => {
    const loadMessages = (conversationId, lastMessageId) => {
        dispatch(messagesRequested(conversationId, 5, lastMessageId));
    }

    return { loadMessages };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MessageList);

function MyComponent({ dispatch }) {
    
  const sendMessage = (conversationId, messageContent) => {
    const messages = {
        id: new Date().getTime(), 
        messageText: messageContent,
        isMyMessage: true,
        createdAt: new Date().toISOString(),
    };

    dispatch(newMessageAdded(conversationId, messages));
    socket.emit('newMessage', { conversationId, messages }); 
}};
