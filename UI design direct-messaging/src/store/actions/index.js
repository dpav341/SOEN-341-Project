export const conversationChanged = conversationId => ({
    type: 'SELECTED_CONVERSATION_CHANGED',
    conversationId
});

export const conversationsRequested = () => ({
    type: 'CONVERSATIONS_REQUESTED'
});

export const conversationDeleted = () => ({
    type: 'DELETE_CONVERSATION'
});

export const newMessageAdded = (conversationId, messages) => ({
    type: 'NEW_MESSAGE_ADDED',
    payload: { conversationId, messages }
});

export const messagesRequested = (conversationId, numberOfMessages, lastMessageId) => ({
    type: 'MESSAGES_REQUESTED',
    payload: {
        conversationId,
        numberOfMessages,
        lastMessageId
    }
});

export const messagesLoaded = (conversationId, messages, hasMoreMessages, lastMessageId) => ({
    type: 'MESSAGES_LOADED',
    payload: {
        conversationId,
        messages,
        hasMoreMessages,
        lastMessageId
    }
});
