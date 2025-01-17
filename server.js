require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let users = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('user joined', (user) => {
        users.push({ id: socket.id, ...user });
        io.emit('user list', users);
    });

    socket.on('chat message', (data) => {
        io.emit('chat message', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        users = users.filter(user => user.id !== socket.id);
        io.emit('user list', users);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});