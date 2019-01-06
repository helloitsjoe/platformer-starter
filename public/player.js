const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// socket.io script from player.html
const socket = io();

socket.on('connected', () => console.log('connected!'));
socket.on('tap', () => console.log('tapped!'));

document.addEventListener('click', e => {
  socket.emit('tap');
});
