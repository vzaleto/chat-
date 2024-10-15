const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Message = require('./models/message');
const User = require('./models/user');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(bodyParser.json());
app.use(cors());

const SECRET_KEY = 'vnqH31x+LGOIjfwBAMBDHKnaSJ9pL1H9HUe4Ke98jq7GpuLXNBqzip3JozKPDif8';

// Подключение к MongoDB
mongoose
    .connect('mongodb+srv://vzaleto:XyJSsIPC8o5TjdAt@chat.kmgw7.mongodb.net/?retryWrites=true&w=majority&appName=Chat', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Регистрация пользователя
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existUser = await User.findOne({ username });
        if (existUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPass,
        });
        await newUser.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Логин пользователя
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Wrong password' });
        }
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// WebSocket логика
wss.on('connection', async (ws) => {
    console.log("New client connected");

    // Отправляем историю сообщений при подключении
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
        ws.send(JSON.stringify({ type: 'history', messages }));
    } catch (error) {
        console.log(error);
    }

    ws.on('message', async (message) => {
        const data = JSON.parse(message);
        console.log('Received data:', data);

        if (data.token) {
            try {
                const decoded = jwt.verify(data.token, SECRET_KEY);
                const username = decoded.username;

                const newMessage = new Message({
                    sender: username,
                    content: data.content,
                    timestamp: data.timestamp || new Date(),
                });

                await newMessage.save();  // Сохраняем сообщение в базе данных
                console.log('Message saved:', newMessage);

                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'new_message', message: newMessage }));
                    }
                });
            } catch (error) {
                console.log('Token verification failed:', error);
                ws.send(JSON.stringify({ error: 'Token verification failed' }));
            }
        } else {
            console.log('Invalid request: No token provided');
            ws.send(JSON.stringify({ error: 'Invalid request: No token provided' }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Запуск сервера
server.listen(8080, () => {
    console.log('Server is running on port 8080');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
