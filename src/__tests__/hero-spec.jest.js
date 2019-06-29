import Hero, { MAX_VX, TILE_SIZE, HERO_IMAGE_SRC } from '../hero';

let hero;
let canvas;

beforeEach(() => {
  canvas = document.createElement('canvas');
  canvas.height = 800;
  canvas.width = 1000;
  hero = new Hero({ canvas });
});

it('loads image on init', done => {
  const mockImage = { onload: jest.fn() };
  expect(hero.image).toBe(null);
  hero.init(mockImage).then(() => {
    expect(hero.image).toBeTruthy();
    done();
  });
  // trigger onload to get into .then
  mockImage.onload();
});

it('init loads image with none provided', () => {
  hero.loadImage = jest.fn();
  hero.init();
  expect(hero.loadImage).toBeCalled();
});

it('loadImage if none provided', () => {
  hero.loadImage();
  const imgFilename = hero.image.src.slice(hero.image.src.lastIndexOf('/'));
  const srcFilename = HERO_IMAGE_SRC.slice(HERO_IMAGE_SRC.lastIndexOf('/'));
  expect(imgFilename).toBe(srcFilename);
});

it('draws hero', done => {
  const mockCtx = { drawImage: jest.fn() };
  const mockImage = { onload: jest.fn().mockResolvedValue() };
  const x = 0;
  const y = 0;
  hero.place({ x, y });

  const drawImageArgs = [
    mockImage,
    x,
    y,
    TILE_SIZE,
    TILE_SIZE,
    x - hero.width / 2,
    y - hero.height,
    hero.width,
    hero.height,
  ];

  hero.loadImage(mockImage).then(() => {
    expect(mockImage.src).toBe(HERO_IMAGE_SRC);
    hero.draw(mockCtx);
    expect(mockCtx.drawImage).toBeCalledWith(...drawImageArgs);
    hero.moveRight();
    hero.draw(mockCtx);
    // Should offset to 2nd sprite
    const drawImageFlippedArgs = drawImageArgs.map((arg, i) => (i === 1 ? TILE_SIZE : arg));
    expect(mockCtx.drawImage).toBeCalledWith(...drawImageFlippedArgs);
    done();
  });
  // trigger onload to get into .then
  mockImage.onload();
});

// it('draws square hero', () => {
//   const mockCtx = { fillStyle: '', fillRect: jest.fn() };
//   hero.draw(mockCtx);
//   expect(mockCtx.fillStyle).toBe('white');
//   expect(mockCtx.fillRect).toBeCalledTimes(1);
// });

it('uses color if provided', () => {
  const hero2 = new Hero({ color: 'limegreen' });
  const mockCtx = { fillStyle: '', fillRect: jest.fn() };
  hero2.draw(mockCtx);
  expect(mockCtx.fillStyle).toBe('limegreen');
});

it('creates canvas if none provided', () => {
  const hero2 = new Hero();
  expect(hero2.canvas).toBeInstanceOf(HTMLCanvasElement);
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
    expect(hero.facingDirection).toBe(-1);
    expect(hero.x).toBeLessThan(initialX);
  });

  it('hero moves right', () => {
    const initialX = hero.x;
    hero.moveRight();
    hero.update();
    expect(hero.facingDirection).toBe(1);
    expect(hero.x).toBeGreaterThan(initialX);
  });

  it('hero stops (left)', () => {
    hero.moveLeft();
    hero.update();
    expect(hero.vx).toBeLessThan(0);
    hero.stopX();
    expect(hero.vx).toBe(0);
  });

  it('hero stops (right)', () => {
    hero.moveRight();
    hero.update();
    expect(hero.vx).toBeGreaterThan(0);
    hero.stopX();
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
