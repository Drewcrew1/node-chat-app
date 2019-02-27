let socket = io();

let scrollToBottom = () => {
let messages = $('#messages');
let newMessage = messages.children('li:last-child');
let clientHeight = messages.prop('clientHeight');
let scrollTop = messages.prop('scrollTop');
let scrollHeight = messages.prop('scrollHeight');
let newMessageHeight = newMessage.innerHeight();
let lastMessageheight = newMessage.prev().innerHeight();
if(clientHeight + scrollTop + newMessageHeight + lastMessageheight >= scrollHeight){
messages.scrollTop(scrollHeight);
}
};

socket.on('connect',() => {
    console.log('connected to server');

});
socket.on('disconnect',() => {
    console.log('disconnected from server');
});

socket.on('newMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = $('#message-template').html();
    let html = Mustache.render(template,{
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
    //
    // let li = $('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    //
    // $('#messages').append(li);
});

socket.on('newLocationMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = $('#location-message-template').html();
    let html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
    // let li = $('<li></li>');
    // let a = $('<a target="_blank">My Current Location</a>');
    //
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
    // $('#messages').append(li);
});

$('#message-form').on('submit', function(e){
    e.preventDefault();

    let messageTextbox = $('[name=message]');

    socket.emit('createMessage',{
        from: 'User',
        text: messageTextbox.val()
    }, () => {
        messageTextbox.val('');
    });
});
let locationButton = $('#send-location');
locationButton.on('click', () => {
   if(!navigator.geolocation){
       return alert('Geolocation not supported by the browser.');
   }
   locationButton.attr('disabled', 'disabled').text('Sending Location..');
   navigator.geolocation.getCurrentPosition((position) => {
       locationButton.removeAttr('disabled').text('Send Location');
     socket.emit('createLocationMessage',{
         latitude: position.coords.latitude,
         longitude: position.coords.longitude
     });
   }, () => {
       locationButton.removeAttr('disabled').text('Send Location');
       alert('Unable to fetch location.');
   });
});

