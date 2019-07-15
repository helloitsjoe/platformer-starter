import Hero, { getAlpha, MAX_VX, HERO_IMAGE_SRC } from '../hero';
import Renderer, { TILE_SIZE } from '../renderer';

let hero;
let canvas;
let renderer;

beforeEach(() => {
  canvas = document.createElement('canvas');
  renderer = new Renderer();
  canvas.height = 800;
  canvas.width = 1000;
  hero = new Hero({ canvas, renderer });
});

afterEach(jest.clearAllMocks);

it('loads image on init', () => {
  renderer.loadImage = jest.fn();
  hero.init();
  const src = HERO_IMAGE_SRC;
  const tileW = TILE_SIZE;
  const tileH = TILE_SIZE;
  expect(renderer.loadImage).toBeCalledWith({ src, tileW, tileH });
});

it('hero.draw calls ctx.drawImage', () => {
  hero.init();
  const drawImage = jest.fn();
  const ctx = { save: jest.fn(), restore: jest.fn(), drawImage };
  hero.draw(ctx);
  expect(ctx.drawImage).toBeCalledTimes(2);
});

it('drawImage calls drawSkull/drawEyes', () => {
  hero.drawSkull = jest.fn();
  hero.drawEyes = jest.fn();
  hero.draw();
  expect(hero.drawSkull).toBeCalled();
  expect(hero.drawEyes).toBeCalled();
});

it('gives renderer width/height', () => {
  expect(renderer.width).toBeGreaterThan(0);
  expect(renderer.height).toBeGreaterThan(0);
});

it('creates canvas if none provided', () => {
  const hero2 = new Hero();
  expect(hero2.canvas).toBeInstanceOf(HTMLCanvasElement);
});

describe('getAlpha', () => {
  it.each`
    tick | alpha
    ${1} | ${0.5}
    ${2} | ${0.75}
    ${3} | ${1}
    ${4} | ${0.25}
  `('tick $tick is $alpha', ({ tick, alpha }) => {
  const ANIM_FACTOR = 4;
  expect(getAlpha(tick % ANIM_FACTOR, ANIM_FACTOR)).toBe(alpha);
});
});

describe('movement', () => {
  it('puts hero at bottom middle of screen', () => {
    expect(hero.getBottom()).toBe(canvas.height);
    expect(hero.x).toBe(canvas.width / 2);
  });

  it('hero.place({ x, y }) teleports to x and y', () => {
    hero.place({ x: 42, y: 256 });
    expect(hero.x).toBe(42);
    expect(hero.y).toBe(256);
  });

  it('hero.place() uses previous value if x or y is undefined', () => {
    hero.place({ x: 42, y: 256 });
    hero.place({ x: 55 });
    expect(hero.x).toBe(55);
    expect(hero.y).toBe(256);
    hero.place({ y: 128 });
    expect(hero.x).toBe(55);
    expect(hero.y).toBe(128);
    hero.place();
    expect(hero.x).toBe(55);
    expect(hero.y).toBe(128);
  });

  it('hero has no initial velocity', () => {
    expect(hero.vx).toBe(0);
    expect(hero.vy).toBe(0);
  });

  it('hero moves left', () => {
    const initialX = hero.x;
    hero.moveLeft();
    hero.update();
    expect(hero.getDirection()).toBe(-1);
    expect(hero.x).toBeLessThan(initialX);
  });

  it('hero moves right', () => {
    const initialX = hero.x;
    hero.moveRight();
    hero.update();
    expect(hero.getDirection()).toBe(1);
    expect(hero.x).toBeGreaterThan(initialX);
  });

  it('hero stops (left)', () => {
    hero.moveLeft();
    hero.update();
    expect(hero.vx).toBeLessThan(0);
    hero.stopX();
    hero.update();
    expect(hero.vx).toBe(0);
  });

  it('hero stops (right)', () => {
    hero.moveRight();
    hero.update();
    expect(hero.vx).toBeGreaterThan(0);
    hero.stopX();
    hero.update();
    expect(hero.vx).toBe(0);
  });

  it('hero accelerates from a stop, maxes out (left)', () => {
    hero.moveLeft();
    hero.update();
    const vOne = hero.vx;
    hero.update();
    const vTwo = hero.vx;
    expect(vTwo).toBeLessThan(vOne);

    // Get downward speed up to max
    let updateTimes = 30;
    while (updateTimes--) {
      hero.update();
    }

    const vMax = hero.vx;
    hero.update();
    expect(hero.vx).toBe(vMax);
    expect(hero.vx).toBe(-MAX_VX);
  });

  it('hero accelerates from a stop, maxes out (right)', () => {
    hero.moveRight();
    hero.update();
    const vOne = hero.vx;
    hero.update();
    const vTwo = hero.vx;
    expect(vTwo).toBeGreaterThan(vOne);

    // Get downward speed up to max
    let updateTimes = 30;
    while (updateTimes--) {
      hero.update();
    }

    const vMax = hero.vx;
    hero.update();
    expect(hero.vx).toBe(vMax);
    expect(hero.vx).toBe(MAX_VX);
  });

  it('hero downward speed increases, maxes out', () => {
    hero.place({ x: 0, y: 0 });
    const vStart = hero.vy;
    hero.update();
    const vOne = hero.vy;
    expect(vOne).toBeGreaterThan(vStart);
    hero.update();
    const vTwo = hero.vy;
    expect(vTwo).toBeGreaterThan(vOne);

    // Get downward speed up to max
    let updateTimes = 30;
    while (updateTimes--) {
      hero.update();
    }

    const vMax = hero.vy;
    hero.update();
    expect(hero.vy).toBe(vMax);
  });
});
