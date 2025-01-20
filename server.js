require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { connectToMongoDB } = require('./backend/mongo');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let users = [];

connectToMongoDB().then(({ messagesCollection }) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('user joined', (user) => {
            users.push({ id: socket.id, ...user });
            io.emit('user list', users);
        });

        socket.on('chat message', (data) => {
            io.emit('chat message', data);
            try {
                messagesCollection.insertOne(data);
                console.log("Message saved to MongoDB");
            } catch (error) {
                console.error("Failed to save message to MongoDB", error);
            }
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
}).catch((error) => {
    console.error("failed to connect to MongoDB", error);
});
