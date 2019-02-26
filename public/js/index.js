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
let locationButton = $('#send-location');
locationButton.on('click', () => {
   if(!navigator.geolocation){
       return alert('Geolocation not supported by the browser.');
   }
   navigator.geolocation.getCurrentPosition((position) => {
     socket.emit('createLocationMessage',{
         latitude: position.coords.latitude,
         longitude: position.coords.longitude
     });
   }, () => {
       alert('Unable to fetch location.');
   });
});

