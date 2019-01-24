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
  const hero2 = new Hero();
  expect(hero2.canvas).toBeInstanceOf(HTMLCanvasElement);
});

describe('movement', () => {
  it('puts hero at bottom middle of screen', () => {
    expect(hero.y).toBe(canvas.height);
    expect(hero.x).toBe(canvas.width / 2);
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
    const INITIAL_X = 0;
    hero.x = INITIAL_X;
    hero.moveLeft();
    hero.update();
    expect(hero.x).not.toBeLessThan(INITIAL_X);
  });

  it('right wall: should not move right', () => {
    // Position at right wall
    const initialX = canvas.width;
    hero.x = initialX;
    hero.moveRight();
    hero.update();
    // Hero should not move to the right
    expect(hero.x).not.toBeGreaterThan(initialX);
  });

  it('floor: should not move below', () => {
    // Position hero at bottom of screen
    const initialY = canvas.height;
    hero.y = initialY;
    hero.update();
    expect(hero.y).not.toBeGreaterThan(initialY);
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
      hero.x = plat.x + 50;
      hero.y = plat.y - 2;

      hero.update(platforms);
      hero.update(platforms);

      expect(hero.y).toBe(plat.y);
      hero.moveRight();
      expect(hero.y).toBe(plat.y);
    });

    it('hero falls off sides', () => {
      hero.x = plat.x - hero.offsetX - 2;
      hero.y = plat.y - 2;

      hero.update(platforms);
      hero.update(platforms);

      expect(hero.y).toBeGreaterThan(plat.y);

      hero.x = plat.x + plat.width + hero.offsetX + 2;
      hero.y = plat.y - 2;

      hero.update(platforms);
      hero.update(platforms);

      expect(hero.y).toBeGreaterThan(plat.y);
    });

    it('hero can walk underneath platform', () => {
      hero.x = plat.x - hero.offsetX - 2;
      hero.y = canvas.height;

      hero.moveRight();
      hero.update(platforms);
      hero.update(platforms);

      expect(hero.y).toBe(canvas.height);
    });

    xit('hero bumps into left side', () => {});

    xit('hero bumps into right side', () => {});

    it('hero bumps into bottom', () => {
      hero.x = plat.x;
      hero.y = canvas.height;
      plat.y = hero.y - hero.height - plat.height - 10;

      hero.jump();
      hero.update(platforms);
      hero.update(platforms);

      expect(hero.y).toBeGreaterThan(plat.y + plat.height + hero.offsetY);
    });
  });
});
