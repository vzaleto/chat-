const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const Message = require('./models/message');
const User = require('./models/user');
const cors = require('cors')

const fs = require('fs');

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

app.use(bodyParser.json());

app.use(cors());

const SECRET_KEY = 'vnqH31x+LGOIjfwBAMBDHKnaSJ9pL1H9HUe4Ke98jq7GpuLXNBqzip3JozKPDif8';

const getUsers = () => {
    const userData = fs.readFileSync('users.json', 'utf8');

    return JSON.parse(userData);
}
const saveUsers = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2), 'utf8')
}




app.post(`/register`, async (req, res)=>{
    const {username, password} = req.body;

   try {
       const existUser = await User.findOne({username});
       if (existUser){
           return res.status(400).json({message:'user exist'})
       }
       const hanshedPass = await bcrypt.hash(password, 10)
       const newUser = new User({
           username:username,
           password:hanshedPass
       })
       await newUser.save();
       res.status(201).json({message: 'it is ok register'})
   } catch (error) {
       res.status(500).json({message: 'server error'})
   }
})

app.post(`/login`, async(req, res)=>{
    const {username,password} = req.body;
    try{
        const exstUser = await User.findOne({username})
        if(!exstUser){
            return res.status(400).json({message:'user not exist'})
        }
        const passOk = bcrypt.compare(password, exstUser.password)
        if(!passOk){
            return res.status(400).json({message:'wrong password'})
        }
        res.status(200).json({message:'login success', username: exstUser.username})

    }catch (error) {
        res.status(500).json({message: 'server error'})
    }
})



mongoose.connect('mongodb+srv://vzaleto:Dbx5aHNEc5tWQMLk@chat.kmgw7.mongodb.net/?retryWrites=true&w=majority&appName=Chat', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected')
}).catch((err) => {
    console.log(err)
})

wss.on('connection', async (ws) => {    //   ws
    console.log('New client connected');
    const messages = await Message.find().sort({timestamp: 1});
    ws.send(JSON.stringify(messages))

    ws.on('message', async (message) => {
        const data = JSON.parse(message);

        if (!data.sender || !data.content) {
            return;
        }

        const newMessage = new Message({sender: data.sender, content: data.content, timestamp: data.timestamp, timestampElse:Date.now()});
        await newMessage.save();

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(newMessage));
            }
        })
    })
    ws.on('close', () => {
        console.log('Client disconnected');
    })
})


server.listen(8080, () => {
    console.log('Server is running on port 8080')
});
app.listen(3000, () => {
    console.log('Server is running on port 3000')
});
