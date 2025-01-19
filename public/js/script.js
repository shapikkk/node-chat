const socket = io();

const loginForm = document.getElementById('login-form');
const signupUsername = document.getElementById('signup-username');

const avatarInput = document.getElementById('avatar-input');
const loginContainer = document.getElementById('login-container');

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
    const avatar = avatarInput.value.trim();

    if (username && avatar) {
        currentUser = { name: username, avatar: avatar };
        socket.emit('user joined', currentUser);
        loginContainer.style.display = 'none';
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim() && currentUser) {
        socket.emit('chat message', {
            user: currentUser,
            message: input.value,
        });
        input.value = '';
    }
});

socket.on('chat message', (data) => {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';

    const avatarElement = document.createElement('img');
    avatarElement.src = data.user.avatar;
    avatarElement.alt = `${data.user.name}'s Avatar`;
    avatarElement.style.width = '30px';
    avatarElement.style.height = '30px';
    avatarElement.style.borderRadius = '50%';
    avatarElement.style.marginRight = '10px';

    const nameElement = document.createElement('span');
    nameElement.textContent = `${data.user.name}: `;
    nameElement.style.fontWeight = 'bold';

    const textElement = document.createElement('span');
    textElement.textContent = data.message;

    //messageElement.appendChild(avatarElement);
    messageElement.appendChild(nameElement);
    messageElement.appendChild(textElement);

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});



// socket.on('user list', (users) => {
//     //userInfo.innerHTML = '';
//     users.forEach(user => {
//         const userElement = document.createElement('div');
//         userElement.className = 'user-info';

//         const avatarElement = document.createElement('img');
//         avatarElement.src = user.avatar;
//         avatarElement.alt = `${user.name}'s Avatar`;

//         const nameElement = document.createElement('div');
//         nameElement.id = 'user-name';
//         nameElement.textContent = user.name;

//         //userElement.appendChild(avatarElement);
//         //userElement.appendChild(nameElement);
//         chatsList.appendChild(userElement);
//     });
// });