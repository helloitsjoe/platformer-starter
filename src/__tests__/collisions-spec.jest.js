import Hero, { GRAVITY, VELOCITY, MAX_VY } from '../hero';
import Platform from '../platform';

let hero;
let canvas;

beforeEach(() => {
  canvas = document.createElement('canvas');
  canvas.height = 800;
  canvas.width = 1000;
  hero = new Hero({ canvas });
});

describe('collisions', () => {
  it('left wall: should not move left', () => {
    hero.place({ x: 0 });
    hero.moveLeft();
    hero.update();
    expect(hero.x).toBe(0);
  });

  it('right wall: should not move right', () => {
    // Position at right wall
    hero.place({ x: canvas.width });
    hero.moveRight();
    hero.update();
    // Hero should not move to the right
    expect(hero.x).toBe(canvas.width);
  });

  it('floor: should not move below', () => {
    // Position hero at bottom of screen
    hero.place({ y: canvas.height });
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

    it('hero bumps into left side', () => {
      hero = new Hero({ canvas, accelX: VELOCITY });
      // Platform is sitting on the ground
      plat.place({ y: canvas.height - plat.height });
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

    it('hero bumps into right side', () => {
      hero = new Hero({ canvas, accelX: VELOCITY });
      // Platform is sitting on the ground
      plat.place({ y: canvas.height - plat.height });
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

    it('hero can jump when on ground', () => {
      hero.place({
        x: plat.getLeft() + 50,
        y: plat.getTop(),
      });
      // call update to ground hero
      hero.update(platforms);
      hero.jump();
      hero.update(platforms);

      // vy < 0 is moving up
      expect(hero.vy).toBeLessThan(0);
    });

    it('hero CANNOT jump when NOT on ground', () => {
      hero.place({
        x: plat.getLeft() + 50,
        // move hero above top of platform
        y: plat.getTop() + 100,
      });
      hero.update(platforms);
      hero.jump();
      hero.update(platforms);

      // vy > 0 is moving down
      expect(hero.vy).toBeGreaterThan(0);
    });

    it('cancelJump stops upward momentum', () => {
      hero.place({
        x: plat.getLeft() + 50,
        y: plat.getTop(),
      });
      hero.update(platforms);
      hero.jump();
      expect(hero.vy).toBe(-MAX_VY);
      hero.update(platforms);
      expect(hero.vy).toBe(-MAX_VY + GRAVITY);
      hero.cancelJump();
      expect(hero.vy).not.toBe(-MAX_VY + GRAVITY * 2);
      expect(hero.vy).toBe(-VELOCITY);
    });

    it('cancelJump does not affect downward momentum', () => {
      hero.place({
        x: plat.getLeft() + 50,
        y: plat.getTop(),
      });
      hero.update(platforms);
      hero.jump();
      expect(hero.vy).toBeLessThan(0);
      let updateTimes = 30;
      while (updateTimes--) {
        hero.update(platforms);
      }
      const vInitialDescent = hero.vy;
      expect(vInitialDescent).toBeGreaterThan(0);
      hero.cancelJump();
      hero.update(platforms);
      expect(hero.vy).toBe(vInitialDescent + GRAVITY);
      expect(hero.vy).not.toBe(-VELOCITY);
    });
  });
});
