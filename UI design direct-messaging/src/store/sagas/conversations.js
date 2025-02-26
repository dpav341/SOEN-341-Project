import { put, takeEvery } from 'redux-saga/effects';

import { messagesLoaded } from '../actions';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const conversations = [
    { 
        id: '1',
        title: 'Nicolas G',
        imageUrl: require('../../images/profiles/nicolas.jpeg'),
        imageAlt: 'nicolas',
        createdAt: 'Feb 12',
        latestMessageText: 'latest',
        messages: [
            {
                imageUrl: null,
                imageAlt: null,
                messageText: 'Hi',
                createdAt: 'Feb 12',
                isMyMessage: true
            },
        ]
    },
    {
        id: '2', 
        imageUrl: require('../../images/profiles/rima.jpeg'),
        imageAlt: 'rima',
        title: 'Rima G',
        createdAt: 'Feb 12',
        latestMessageText: 'latest',
        messages: []
    },
    
];

export const conversationsSaga = function*() {
    yield delay(1000);
    yield put(messagesLoaded(conversations[0].id, conversations[0].messages, false, null));

    yield put({
        type: 'CONVERSATIONS_LOADED',
        payload: {
            conversations,
            selectedConversation: conversations[0]
        }
    });
}

export function* watchGetConversationsAsync() {
    yield takeEvery('CONVERSATIONS_REQUESTED', conversationsSaga);
}