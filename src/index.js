/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import Hero from './hero';
import { createPlatforms } from './platform';
import Background from './background';
import Keyboard from './keyboard';
import Socket from './socket';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function fillScreen(canv) {
  canv.width = window.innerWidth;
  canv.height = window.innerHeight;
}

fillScreen(canvas);
window.addEventListener('resize', () => fillScreen(canvas));

const bg = new Background({ canvas });
const hero = new Hero({ canvas });
hero.init().then(() => {
  const platforms = createPlatforms({ canvas });

  const keyboardInput = new Keyboard(hero, window);
  const socketInput = new Socket(hero, window);

  function update(/* deltaTime */) {
    // TODO: move ctx into renderer?
    bg.draw(ctx);
    hero.update(platforms);
    hero.draw(ctx);
    platforms.forEach(platform => platform.draw(ctx));

    requestAnimationFrame(update);
  }

  update();
});
