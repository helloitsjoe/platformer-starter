import Hero from './hero';
import { makePlatform } from './platform';
import Keyboard from './keyboard';
import Socket from './socket';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

fillScreen(canvas);
window.addEventListener('resize', () => fillScreen(canvas));

function fillScreen(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const hero = new Hero({ canvas });
const platforms = new Array(5)
  .fill(null)
  .map(makePlatform({ maxX: canvas.width, maxY: canvas.height }));
const keyboardInput = new Keyboard(hero, window);
const socketInput = new Socket(hero, window);

function update(deltaTime) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  hero.update();
  hero.draw(ctx);
  platforms.forEach(platform => platform.draw(ctx));

  requestAnimationFrame(update);
}

update();
