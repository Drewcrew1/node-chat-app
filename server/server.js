const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {isRealString} = require('./utils/validation');
const publicPath = path.join(__dirname, '../public');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const port = process.env.PORT || 3045;
const app = express();

let server = http.createServer(app);
let io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');


socket.on('join', (params, callback) => {
if(!isRealString(params.name) || !isRealString(params.room)){
    callback('Name and room name are required.');
}
socket.join(params.room);

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to The Chat-App'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
callback();
});

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();

    });
socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin',coords.latitude, coords.longitude))
});

    socket.on('disconnect', () => {
       console.log('user was disconnected');
    });
});



server.listen(port);