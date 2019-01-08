import Hero from '../hero';

let hero;
let canvas = document.createElement('canvas');

beforeEach(() => {
  hero = new Hero({ canvas });
});

describe('movement', () => {
  it('puts hero at bottom middle of screen', () => {
    expect(hero.y).toBe(canvas.height - hero.height);
    expect(hero.x).toBe(canvas.width / 2 - hero.width / 2);
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
    const initialX = canvas.width - hero.width;
    hero.x = initialX;
    hero.moveRight();
    hero.update();
    // Hero should not move to the right
    expect(hero.x).not.toBeGreaterThan(initialX);
  });

  it('floor: should not move below', () => {
    // Position hero at bottom of screen
    const initialY = canvas.height - hero.height;
    hero.y = initialY;
    hero.update();
    expect(hero.y).not.toBeGreaterThan(initialY);
  });
});
