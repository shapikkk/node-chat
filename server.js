require('dotenv').config();
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const { Server } = require('socket.io');
const path = require('path');
const { connectToMongoDB } = require('./backend/mongo');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

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

    // Registration route
    app.post('/signup', async (req, res) => {
        const { username, password } = req.body;
        try {
            const existingUser = await usersCollection.findOne({ username });
            if (existingUser) {
                return res.status(400).send('User already exists');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await usersCollection.insertOne({ username, password: hashedPassword });
            res.status(201).send('User registered');
        } catch (error) {
            console.error("Failed to register user", error);
            res.status(500).send('Internal server error');
        }
    });

    // Login route
    app.post('/login', async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await usersCollection.findOne({ username });
            if (user && await bcrypt.compare(password, user.password)) {
                res.status(200).send('Login successful');
            } else {
                res.status(401).send('Invalid credentials');
            }
        } catch (error) {
            console.error("Failed to login user", error);
            res.status(500).send('Internal server error');
        }
    });

    const PORT = process.env.PORT || 80;
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });

    // HTTPS server setup
    const httpsOptions = {
        key: fs.readFileSync(path.join(__dirname, 'license/key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'license/cert.pem'))
    };

    const httpsServer = https.createServer(httpsOptions, app);
    const HTTPS_PORT = process.env.HTTPS_PORT || 443;
    httpsServer.listen(HTTPS_PORT, () => {
        console.log(`HTTPS Server running on https://localhost:${HTTPS_PORT}`);
    });

    const ioHttps = new Server(httpsServer);
    ioHttps.on('connection', async (socket) => {
        // Load messages from Database
        try {
            const messages = await messagesCollection.find().toArray();
            socket.emit('chat history', messages);
        } catch (error) {
            console.error("Failed to load messages from MongoDB", error);
        }

        socket.on('user joined', async (user) => {
            users.push({ id: socket.id, ...user });
            ioHttps.emit('user list', users);
            try {
                await usersCollection.insertOne(user);
            } catch (error) {
                console.error("Failed to save user to MongoDB", error);
            }
        });

        socket.on('chat message', async (data) => {
            ioHttps.emit('chat message', data);
            try {
                await messagesCollection.insertOne(data);
            } catch (error) {
                console.error("Failed to save message to MongoDB", error);
            }
        });

        socket.on('disconnect', () => {
            users = users.filter(user => user.id !== socket.id);
            ioHttps.emit('user list', users);
        });
    });

}).catch((error) => {
    console.error("Failed to connect to MongoDB", error);
});