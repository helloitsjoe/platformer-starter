const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// socket.io script from player.html
const socket = io();

socket.on('connected', () => console.log('connected!'));

canvas.addEventListener('click', e => {
  socket.emit('tap');
});
