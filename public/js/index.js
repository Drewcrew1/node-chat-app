let socket = io();

socket.on('connect',() => {
    console.log('connected to server');
    socket.emit('createMessage',{
       from: 'andy',
       text: 'yup here'
    });
});
socket.on('disconnect',() => {
    console.log('disconnected from server');
});

socket.on('newMessage', (message) => {
    console.log('newMessage', message);
});