const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = canvas.width / 2;

const body = document.querySelector('body');
const debugPanel = document.createElement('p');
body.appendChild(debugPanel);

const debug = (...args) => {
  debugPanel.innerHTML = args;
};

const isIn = (square, pos) => {
  const [x, y, size] = square;
  return pos.x > x && pos.x < x + size && pos.y > y && pos.y < y + size;
};

const SIZE = canvas.width / 8;

const makeSquare = (x, y, size = SIZE) => [x * size, y * size, size, size];

const upButton = makeSquare(1, 0);
const leftButton = makeSquare(0, 1);
const rightButton = makeSquare(2, 1);
const downButton = makeSquare(1, 2);

const jumpButton = makeSquare(3.5, 0.8, SIZE * 1.5);

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = 'red';
ctx.fillRect(...upButton);
ctx.fillRect(...leftButton);
ctx.fillRect(...rightButton);
ctx.fillRect(...downButton);

ctx.fillRect(...jumpButton);

// socket.io script from player.html
// eslint-disable-next-line
const socket = io();

socket.on('connected', () => console.log('connected!'));

canvas.addEventListener('touchstart', e => {
  const { pageX: x, pageY: y } = e.changedTouches[0];
  if (isIn(leftButton, { x, y })) {
    debug('LEFT DOWN');
    socket.emit('tapDown', 'padLeft');
  } else if (isIn(rightButton, { x, y })) {
    debug('RIGHT DOWN');
    socket.emit('tapDown', 'padRight');
  } else if (isIn(jumpButton, { x, y })) {
    debug('BUTTON DOWN');
    socket.emit('tapDown', 'button');
  }
});

canvas.addEventListener('touchend', e => {
  const { pageX: x, pageY: y } = e.changedTouches[0];
  if (isIn(leftButton, { x, y })) {
    debug('LEFT UP');
    socket.emit('tapUp', 'padLeft');
  } else if (isIn(rightButton, { x, y })) {
    debug('RIGHT UP');
    socket.emit('tapUp', 'padRight');
  } else if (isIn(jumpButton, { x, y })) {
    debug('BUTTON UP');
    socket.emit('tapUp', 'button');
  }
});
