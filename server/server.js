const express = require('express');
const WebSocket = require('ws');


const app = express();
const SECRET_KEY = 'vnqH31x+LGOIjfwBAMBDHKnaSJ9pL1H9HUe4Ke98jq7GpuLXNBqzip3JozKPDif8';

app.post('/register',(req, res)=>{
    const {username, password} = req.body;
})


app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
});