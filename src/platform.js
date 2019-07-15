import Renderer from './renderer';

export const DEFAULT_PLATFORM_HEIGHT = 30;
export const DEFAULT_PLATFORM_WIDTH = 200;
export const DEFAULT_PLATFORMS = 5;

export default class Platform {
  constructor({
    x,
    y,
    width = DEFAULT_PLATFORM_WIDTH,
    height = DEFAULT_PLATFORM_HEIGHT,
    renderer = new Renderer(),
  } = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.renderer = renderer;
  }

  draw(ctx) {
    const { x, y, width, height } = this;
    this.renderer.drawRect({ ctx, color: 'red', x, y, width, height });
  }

  getTop() {
    return this.y;
  }

  getBottom() {
    return this.y + this.height;
  }

  getLeft() {
    return this.x;
  }

  getRight() {
    return this.x + this.width;
  }

  place({ x = this.x, y = this.y } = {}) {
    this.x = x;
    this.y = y;
  }
}

export const makeRandomPlatform = ({
  maxX,
  maxY,
  // minX = 0,
  // minY = 0,
  width = DEFAULT_PLATFORM_WIDTH,
  height = DEFAULT_PLATFORM_HEIGHT,
}) => new Platform({
  // x: Math.floor(Math.random() * (maxX - minX) + minX - width * 2),
  // y: Math.floor(Math.random() * (maxY - minY) + minY - height * 2),
  x: Math.floor(Math.random() * (maxX - width)),
  y: Math.floor(Math.random() * (maxY - height)),
  width,
  height,
});

export const createPlatforms = ({
  canvas = document.createElement('canvas'),
  num = DEFAULT_PLATFORMS,
} = {}) => {
  const ground = new Platform({
    x: 0,
    y: canvas.height - DEFAULT_PLATFORM_HEIGHT,
    width: canvas.width,
  });

  // create platform for testing left/right collisions
  const testPlatform = new Platform({
    x: canvas.width - 300,
    y: canvas.height - 100,
    width: 200,
    height: 100,
  });

  const randoms = new Array(num).fill(null).map(plat => makeRandomPlatform({
    maxX: canvas.width,
    maxY: canvas.height - DEFAULT_PLATFORM_HEIGHT * 2,
  }));
  return [ground, testPlatform, ...randoms];
};
