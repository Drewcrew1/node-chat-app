let socket = io();

socket.on('connect',() => {
    console.log('connected to server');

});
socket.on('disconnect',() => {
    console.log('disconnected from server');
});

socket.on('newMessage', (message) => {
    console.log('newMessage', message);
    let li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    $('#messages').append(li);
});



$('#message-form').on('submit', function(e){
    e.preventDefault();

    socket.emit('createMessage',{
        from: 'User',
        text: $('[name=message]').val()
    }, () => {

    });
});