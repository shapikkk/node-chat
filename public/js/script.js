const socket = io();

const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');

const usernameInput = document.getElementById('username-input');
const signupUsername = document.getElementById('signup-username');

const avatarInput = document.getElementById('avatar-input');

const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const messagesDiv = document.getElementById('messages');
const chatsList = document.getElementById('chats-list');
const userInfo = document.getElementById('user-info');

document.getElementById('login-button').addEventListener('click', () => {
    window.location.href = './login-form/login.html#form2';
});

document.getElementById('signup-button').addEventListener('click', () => {
    window.location.href = './login-form/login.html#form1';
});

let currentUser = null;

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();

    if (username) {
        currentUser = { name: username} 
        socket.emit('user joined', currentUser);
        loginContainer.style.display = 'none';
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim() && currentUser) {
        socket.emit('chat message', {
            user: currentUser.name,
            message: input.value,
        });
        input.value = '';
    }
});

socket.on('chat history', (messages) => {  
    const messagesDiv = document.getElementById('messages');
    messages.forEach(message => {
        const messageElement = document.createElement('p');
        messageElement.textContent = `${message.user}: ${message.message}`;
        messagesDiv.appendChild(messageElement);
    });
});

socket.on('chat message', (data) => {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('p');
    messageElement.textContent = `${data.user}: ${data.message}`;
    
    const nameElement = document.createElement('span');
    nameElement.textContent = `${data.user.name}: `;
    nameElement.style.fontWeight = 'bold';

    const textElement = document.createElement('span');
    textElement.textContent = data.message;

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});