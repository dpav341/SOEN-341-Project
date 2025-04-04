const socket = io('ws://localhost:3500')

const msgInput = document.querySelector('#message')
const nameInput = document.querySelector('#name')
const chatRoom = document.querySelector('#room')
const activity = document.querySelector('.activity')
const usersList = document.querySelector('.user-list')
const roomList = document.querySelector('.room-list')
const chatDisplay = document.querySelector('.chat-display')

const isAdmin = nameInput.value === "Admin" // Adjust logic as needed for authentication

function sendMessage(e) {
    e.preventDefault()
    if (nameInput.value && msgInput.value && chatRoom.value) {
        socket.emit('message', {
            name: nameInput.value,
            text: msgInput.value,
            room: chatRoom.value
        })
        msgInput.value = ""
    }
    msgInput.focus()
}

function enterRoom(e) {
    e.preventDefault()
    if (nameInput.value && chatRoom.value) {
        socket.emit('enterRoom', {
            name: nameInput.value,
            room: chatRoom.value
        })
    }
}

document.querySelector('.form-msg')
    .addEventListener('submit', sendMessage)

document.querySelector('.form-join')
    .addEventListener('submit', enterRoom)

msgInput.addEventListener('keypress', () => {
    socket.emit('activity', nameInput.value)
})

// Listen for messages 
socket.on("message", (data) => {
    activity.textContent = ""
    addMessageToChat(data)
})

socket.on("messageList", (data) => {
    activity.textContent = ""
    data.forEach(addMessageToChat)
    chatDisplay.scrollTop = chatDisplay.scrollHeight
})

function addMessageToChat(data) {
    const { id, name, text, time } = data
    const li = document.createElement('li')
    li.className = 'post'
    li.dataset.id = id

    if (name === nameInput.value) {
        li.classList.add('post--left')
    } else if (name !== 'Admin') {
        li.classList.add('post--right')
    }

    li.innerHTML = `
        <div class="post__header ${name === nameInput.value ? 'post__header--user' : 'post__header--reply'}">
            <span class="post__header--name">${name}</span>
            <span class="post__header--time">${time}</span>
        </div>
        <div class="post__text">${text}</div>
        ${isAdmin ? `<button class="delete-btn" data-id="${id}">Delete</button>` : ""}
    `

    if (isAdmin) {
        li.querySelector('.delete-btn').addEventListener('click', () => {
            socket.emit('deleteMessage', { id })
        })
    }

    chatDisplay.appendChild(li)
}

// Remove deleted messages from the UI
socket.on("messageDeleted", (data) => {
    const msgElement = document.querySelector(`[data-id="${data.id}"]`)
    if (msgElement) {
        msgElement.remove()
    }
})

function showUsers(users) {
    usersList.textContent = ''
    if (users) {
        usersList.innerHTML = `<em>Users in ${chatRoom.value}:</em>`
        users.forEach((user, i) => {
            usersList.textContent += ` ${user.name}`
            if (users.length > 1 && i !== users.length - 1) {
                usersList.textContent += ","
            }
        })
    }
}

function showRooms(rooms) {
    roomList.textContent = ''
    if (rooms) {
        roomList.innerHTML = '<em>Active Rooms:</em>'
        rooms.forEach((room, i) => {
            roomList.textContent += ` ${room}`
            if (rooms.length > 1 && i !== rooms.length - 1) {
                roomList.textContent += ","
            }
        })
    }
}
