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

connectToMongoDB().then(({ usersCollection, messagesCollection }) => {
    io.on('connection', async (socket) => {

        // Load messages from Database
        try {
            const messages = await messagesCollection.find().toArray();
            socket.emit('chat history', messages);
        } catch (error) {
            console.error("Failed to load messages from MongoDB", error);
        }

        socket.on('user joined', async (user) => {
            users.push({ id: socket.id, ...user });
            io.emit('user list', users);
            try {
                await usersCollection.insertOne(user);
            } catch (error) {
                console.error("Failed to save user to MongoDB", error);
            }
        });

        socket.on('chat message', async (data) => {
            io.emit('chat message', data);
            try {
                await messagesCollection.insertOne(data);
            } catch (error) {
                console.error("Failed to save message to MongoDB", error);
            }
        });

        socket.on('disconnect', () => {
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
