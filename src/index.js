
class Hero {
  setOrigin(x, y) {
    this.x = x;
    this.y = y;
  }
  width = 20;
  height = 20;
  vx = 0;
  vy = 0;
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const hero = new Hero();

const x = canvas.width / 2 - hero.width / 2;
const y = canvas.height - hero.height;

hero.setOrigin(x, y);

const V = 3;
const GRAVITY = 0.7;

document.addEventListener('keydown', e => {
  switch (e.code) {
    case 'ArrowLeft':
      hero.vx = V * -1;
      break;
    case 'ArrowRight':
      hero.vx = V;
      break;
    case 'Space':
      console.log('jump');
      hero.vy = -V * 3;
      break;
    default:
      console.log(`e.code:`, e.code);
  }
});
document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
    case 'ArrowRight':
      hero.vx = 0;
      break;
    case 'Space':
      hero.vy = 0;
      break;
    default:
      console.log(`e.code:`, e.code);
  }
});

function drawHero(deltaTime) {
  hero.x += hero.vx;
  hero.y += hero.vy;
  hero.vy += GRAVITY;
  if (hero.y + hero.height > canvas.height) {
    hero.y = canvas.height - hero.height;
  }
  ctx.fillStyle = 'white';
  ctx.fillRect(hero.x, hero.y, hero.width, hero.height);
}

function update(deltaTime) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawHero(deltaTime);
  requestAnimationFrame(update);
}

update();

