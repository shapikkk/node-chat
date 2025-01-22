const socket = io();

const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const messagesDiv = document.getElementById('messages');

document.addEventListener('DOMContentLoaded', () => {
    currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = './login-form/login.html';
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim()) {
        socket.emit('chat message', {
            user: currentUser,
            message: input.value,
        });
        input.value = '';
    }
});

socket.on('chat history', (messages) => {
    messages.forEach(message => {
        const messageElement = document.createElement('p');
        messageElement.textContent = `${message.user}: ${message.message}`;
        messagesDiv.appendChild(messageElement);
    });
});

socket.on('chat message', (data) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = `${data.user}: ${data.message}`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

document.getElementById('login-button').addEventListener('click', () => {
    window.location.href = './login-form/login.html#form2';
});

document.getElementById('signup-button').addEventListener('click', () => {
    window.location.href = './login-form/login.html#form1';
});