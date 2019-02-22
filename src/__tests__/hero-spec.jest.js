import Hero from '../hero';
import Platform from '../platform';

let hero;
let canvas;

beforeEach(() => {
  canvas = document.createElement('canvas');
  canvas.height = 800;
  canvas.width = 1000;
  hero = new Hero({ canvas });
});

it('draws hero', () => {
  const mockCtx = { fillStyle: '', fillRect: jest.fn() };
  hero.draw(mockCtx);
  expect(mockCtx.fillStyle).toBe('white');
  expect(mockCtx.fillRect).toBeCalledTimes(1);
});

it('creates canvas if none provided', () => {
  let hero2 = new Hero();
  expect(hero2.canvas).toBeInstanceOf(HTMLCanvasElement);
  hero2 = null;
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

  it('hero jumps', () => {
    const initialY = hero.y;
    hero.jump();
    hero.update();
    expect(hero.y).toBeLessThan(initialY);
  });

  it('hero moves left', () => {
    const initialX = hero.x;
    hero.moveLeft();
    hero.update();
    expect(hero.x).toBeLessThan(initialX);
  });

  it('hero moves right', () => {
    const initialX = hero.x;
    hero.moveRight();
    hero.update();
    expect(hero.x).toBeGreaterThan(initialX);
  });

  it('hero drops if not on floor', () => {
    const INITIAL_Y = 50;
    hero.y = INITIAL_Y;
    hero.update();
    expect(hero.y).toBeGreaterThan(INITIAL_Y);
  });

  it('hero stops', () => {
    hero.moveLeft();
    expect(hero.vx).toBeLessThan(0);
    hero.stopX();
    expect(hero.vx).toBe(0);

    hero.moveRight();
    expect(hero.vx).toBeGreaterThan(0);
    hero.stopX();
    expect(hero.vx).toBe(0);
  });
});

describe('collisions', () => {
  it('left wall: should not move left', () => {
    hero.x = 0;
    hero.moveLeft();
    hero.update();
    expect(hero.x).toBe(0);
  });

  it('right wall: should not move right', () => {
    // Position at right wall
    hero.x = canvas.width;
    hero.moveRight();
    hero.update();
    // Hero should not move to the right
    expect(hero.x).toBe(canvas.width);
  });

  it('floor: should not move below', () => {
    // Position hero at bottom of screen
    hero.y = canvas.height;
    hero.update();
    expect(hero.getBottom()).not.toBeGreaterThan(canvas.height);
  });

  describe('platform', () => {
    let plat;
    let platforms;

    beforeEach(() => {
      plat = new Platform({
        x: 600,
        y: 600,
        width: 100,
        height: 30,
      });
      platforms = [plat];
    });

    it('hero rests on top', () => {
      hero.place({
        x: plat.getLeft() + 50,
        y: plat.getTop() - 2,
      });

      hero.update(platforms);
      hero.update(platforms);

      expect(hero.getBottom()).toBe(plat.getTop());
      hero.moveRight();
      expect(hero.getBottom()).toBe(plat.getTop());
    });

    it('hero falls off sides', () => {
      // Place hero on left edge of platform
      hero.place({
        x: plat.getLeft() - hero._offsetX + 2,
        y: plat.getTop(),
      });

      hero.moveLeft();

      hero.update(platforms);
      hero.update(platforms);

      expect(hero.getBottom()).toBeGreaterThan(plat.getTop());

      // Place hero on right edge of platform
      hero.place({
        x: plat.getRight() + hero._offsetX + 2,
        y: plat.getTop(),
      });

      hero.moveRight();

      hero.update(platforms);
      hero.update(platforms);

      expect(hero.getBottom()).toBeGreaterThan(plat.getTop());
    });

    it('hero can walk underneath platform', () => {
      hero.place({
        x: plat.getLeft() - hero._offsetX - 2,
        y: canvas.height,
      });

      hero.moveRight();
      hero.update(platforms);
      hero.update(platforms);

      expect(hero.y).toBe(canvas.height);
    });

    xit('hero bumps into left side', () => {
      // Platform is sitting on the ground
      plat.move({ y: canvas.height - plat.height });
      hero.place({
        x: plat.getLeft() - hero._offsetX - 2,
        y: canvas.height,
      });
      hero.moveRight();
      hero.update(platforms);
      hero.update(platforms);

      expect(hero.getRight()).toBe(plat.getLeft());
      expect(hero.getBottom()).toBe(canvas.height);
    });

    xit('hero bumps into right side', () => {
      // Platform is sitting on the ground
      plat.move({ y: canvas.height - plat.height });
      hero.place({
        x: plat.getRight() + hero._offsetX + 2,
        y: canvas.height,
      });
      hero.moveLeft();
      hero.update(platforms);
      hero.update(platforms);

      expect(hero.getLeft()).toBe(plat.getRight());
      expect(hero.getBottom()).toBe(canvas.height);
    });

    it('hero bumps into bottom', () => {
      hero.place({
        x: plat.getLeft(),
        y: canvas.height,
      });
      // Place bottom of platform 10px above hero
      plat.y = hero.getTop() - plat.height - 10;

      hero.jump();
      hero.update(platforms);
      hero.update(platforms);

      expect(hero.getTop()).toBeGreaterThan(plat.getBottom());
    });
  });
});
