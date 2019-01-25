import Hero from './hero';
import Platform, { makeRandomPlatform } from './platform';
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
  .map(makeRandomPlatform({ maxX: canvas.width, maxY: canvas.height }));
// create platform for testing left/right collisions
platforms.push(
  new Platform({
    x: canvas.width - 300,
    y: canvas.height - 40,
    width: 200,
    height: 30,
  })
);
const keyboardInput = new Keyboard(hero, window);
const socketInput = new Socket(hero, window);

function update(deltaTime) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  hero.update(platforms);
  hero.draw(ctx);
  platforms.forEach(platform => platform.draw(ctx));

  requestAnimationFrame(update);
}

update();
