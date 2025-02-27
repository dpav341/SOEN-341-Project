const initialState = {
    messageDetails: {}
}

const messagesReducer = (state = { messageDetails: {} }, action) => {
    switch (action.type) {
        case 'MESSAGES_LOADED':
            
            return {
                ...state,
                messageDetails: {
                    ...state.messageDetails,
                    [action.payload.conversationId]: {
                        ...state.messageDetails[action.payload.conversationId],
                        messages: action.payload.messages,
                        hasMoreMessages: action.payload.hasMoreMessages,
                        lastMessageId: action.payload.lastMessageId
                    }
                }
            };
        case 'NEW_MESSAGE_ADDED':
            
            const { conversationId, message } = action.payload;
            const existingMessages = state.messageDetails[conversationId]?.messages || [];
            return {
                ...state,
                messageDetails: {
                    ...state.messageDetails,
                    [conversationId]: {
                        ...state.messageDetails[conversationId],
                        messages: [...existingMessages, message]
                    }
                }
            };
        default:
            return state;
    }
};

export default messagesReducer;
