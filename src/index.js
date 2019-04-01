import Hero from './hero';
import Platform, { makeRandomPlatform, createPlatforms } from './platform';
import Background from './background';
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

const bg = new Background({ canvas });
const hero = new Hero({ canvas });
const platforms = createPlatforms({ canvas });

const keyboardInput = new Keyboard(hero, window);
const socketInput = new Socket(hero, window);

function update(/* deltaTime */) {
  bg.draw(ctx);
  hero.update(platforms);
  hero.draw(ctx);
  platforms.forEach(platform => platform.draw(ctx));

  requestAnimationFrame(update);
}

update();
