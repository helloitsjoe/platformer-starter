const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = canvas.width / 2;

const isIn = (pos, square) => {
  const [x, y, size] = square;
  return pos.x > x && pos.x < x + size && pos.y > y && pos.y < y + size;
};

const makeSquare = (x, y, size = SIZE) => [x * size, y * size, size, size];

const SIZE = canvas.width / 6;

const upButton = makeSquare(1, 0);
const leftButton = makeSquare(0, 1);
const rightButton = makeSquare(2, 1);
const downButton = makeSquare(1, 2);

const jumpButton = makeSquare(1.7, 0.3, SIZE * 2);

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = 'red';
ctx.fillRect(...upButton);
ctx.fillRect(...leftButton);
ctx.fillRect(...rightButton);
ctx.fillRect(...downButton);

ctx.fillStyle = 'white';
ctx.fillRect(...jumpButton);

// socket.io script from player.html
const socket = io();

socket.on('connected', () => console.log('connected!'));

canvas.addEventListener('touchstart', e => {
  const { pageX: x, pageY: y } = e;
  if (isIn({ x, y }, leftButton)) {
    socket.emit('tapDown', 'padLeft');
  } else if (isIn({ x, y }, rightButton)) {
    socket.emit('tapDown', 'padRight');
  } else if (isIn({ x, y }, jumpButton)) {
    socket.emit('tapDown', 'button');
  }
});

canvas.addEventListener('touchend', e => {
  const { pageX: x, pageY: y } = e;
  if (isIn({ x, y }, leftButton)) {
    socket.emit('tapUp', 'padLeft');
  } else if (isIn({ x, y }, rightButton)) {
    socket.emit('tapUp', 'padRight');
  } else if (isIn({ x, y }, jumpButton)) {
    socket.emit('tapUp', 'button');
  }
});
