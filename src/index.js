import Hero from './hero';
import { Keyboard } from './keyboard';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

fillScreen(canvas);
window.addEventListener('resize', () => fillScreen(canvas));

function fillScreen(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const hero = new Hero(canvas);
const keyboard = new Keyboard(window, hero);

const GRAVITY = 0.7;

function drawHero(deltaTime) {
  hero.x += hero.vx;
  hero.y += hero.vy;
  hero.vy += GRAVITY;

  checkWallCollision(hero, canvas);

  ctx.fillStyle = 'white';
  ctx.fillRect(hero.x, hero.y, hero.width, hero.height);
}

function update(deltaTime) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawHero(deltaTime);
  requestAnimationFrame(update);
}

function checkWallCollision(hero, canvas) {
  if (hero.y + hero.height > canvas.height) {
    hero.y = canvas.height - hero.height;
  }
  if (hero.x < 0) {
    hero.x = 0;
    hero.vx *= -1;
  }
  if (hero.x > canvas.width) {
    hero.x = canvas.width;
    hero.vx *= -1;
  }
}

update();
