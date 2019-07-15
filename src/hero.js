import Renderer, { TILE_SIZE } from './renderer';

export const GRAVITY = 0.7;
export const VELOCITY = 5;
export const MAX_VX = 5;
export const MAX_VY = VELOCITY * 3;
export const HERO_SIZE = 40;
export const HERO_IMAGE_SRC = './assets/skull.png';

export function getAlpha(tick, speedFactor) {
  if (tick < speedFactor * 0.25) return 0.25;
  if (tick < speedFactor * 0.5) return 0.5;
  if (tick < speedFactor * 0.75) return 0.75;
  return 1;
}

export default class Hero {
  constructor({
    canvas,
    x,
    y,
    color = 'white',
    grounded = true,
    accelX = 0.75,
    renderer = new Renderer(),
  } = {}) {
    this.canvas = canvas || document.createElement('canvas');
    this.x = x || this.canvas.width / 2;
    this.y = y || this.canvas.height;

    this.vx = 0;
    this.vy = 0;
    this.width = HERO_SIZE;
    this.height = HERO_SIZE;

    this.renderer = renderer;
    this.renderer.setWidth(this.width);
    this.renderer.setHeight(this.height);

    this._direction = 1;
    this._color = color;
    this._accelX = accelX;
    this._grounded = grounded;
    this._offsetX = this.width / 2;
    this._offsetY = this.height;
    this._marginX = this.width - (VELOCITY + 1);

    this.jump = this.jump.bind(this);
    this.stopX = this.stopX.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.cancelJump = this.cancelJump.bind(this);
  }

  init() {
    return this.renderer.loadImage({ src: HERO_IMAGE_SRC, tileH: TILE_SIZE, tileW: TILE_SIZE });
  }

  getDirection() {
    return this._direction;
  }

  jump() {
    if (this._grounded) {
      this.vy = -MAX_VY;
    }
  }

  cancelJump() {
    // Only cancel velocity if moving upward
    if (this.vy < 0) {
      this.vy = -VELOCITY;
    }
  }

  moveLeft() {
    this._direction = -1;
    this._moving = true;
  }

  moveRight() {
    this._direction = 1;
    this._moving = true;
  }

  stopX() {
    this.vx = 0;
    this._moving = false;
  }

  place({ x = this.x, y = this.y } = {}) {
    this.x = x;
    this.y = y;
  }

  getVX() {
    // Using this._moving to stop motion, in order to use only 1 or -1
    // for this._direction. We could also include 0 for this._direction,
    // but then we need a separate `lookAt` value to determine which
    // way the sprite is facing. Not sure which way is better, but this way
    // seems better than keeping 2 similar-but-different values in sync.
    if (!this._moving) return 0;

    this.vx += this._accelX * this._direction;
    if (Math.abs(this.vx) > MAX_VX) {
      this.vx = MAX_VX * this._direction;
    }
    return this.vx;
  }

  getVY() {
    this.vy += GRAVITY;
    if (this.vy > MAX_VY) {
      this.vy = MAX_VY;
    }
    return this.vy;
  }

  update(platforms) {
    this.x += this.getVX();
    this.y += this.getVY();

    this._checkCollisions(platforms);
  }

  draw(ctx) {
    this.drawSkull({ ctx });
    this.drawEyes({ ctx });
  }

  drawSkull({ ctx }) {
    const x = this.getLeft();
    const y = this.getTop();

    const srcX = this._getSrcX();
    const srcY = 0;

    this.renderer.drawImage({ ctx, srcX, srcY, x, y });
  }

  drawEyes({ ctx }) {
    const x = this.getLeft();
    const y = this.getTop();

    const ANIM_FACTOR = 32;
    ctx.save();
    ctx.globalAlpha = getAlpha(this.renderer.tick % ANIM_FACTOR, ANIM_FACTOR);

    const srcX = this._getSrcX();
    const srcY = 1;
    this.renderer.drawImage({ ctx, srcX, srcY, x, y });
    ctx.restore();
  }

  getTop() {
    return this.y - this._offsetY;
  }

  getBottom() {
    return this.y;
  }

  getLeft() {
    return this.x - this._offsetX;
  }

  getRight() {
    return this.x + this._offsetX;
  }

  _getSrcX() {
    return this._direction > 0 ? 1 : 0;
  }

  _checkCollisions(platforms) {
    this._checkPlatformCollisions(platforms);
    this._checkWallCollisions();
  }

  _checkPlatformCollisions(platforms = []) {
    this._grounded = false;
    platforms.forEach(platform => {
      // Return early if no overlap with platform
      if (this.getRight() < platform.getLeft()) return;
      if (this.getLeft() > platform.getRight()) return;
      if (this.getBottom() < platform.getTop()) return;
      if (this.getTop() > platform.getBottom()) return;

      // TODO: This is a little janky, hero will slip off if very close to the edge.
      // Keep track of prev position instead?
      // OR updateX, checkX, updateY, checkY?
      if (this.getLeft() + this._marginX < platform.getLeft()) {
        this.x = platform.getLeft() - this._offsetX;
      } else if (this.getRight() - this._marginX > platform.getRight()) {
        this.x = platform.getRight() + this._offsetX;
      } else if (this.vy < 0) {
        // If hero collides with the bottom of a platform while
        // jumping, move top of hero to below bottom of platform
        this.y = platform.getBottom() + this._offsetY;
        this.vy = 0;
      } else {
        this.y = platform.getTop();
        this._grounded = true;
        this.vy = 0;
      }
    });
  }

  _checkWallCollisions() {
    if (this.y > this.canvas.height) {
      this.y = this.canvas.height;
      this.vy = 0;
    }
    if (this.x < 0) {
      this.x = 0;
      this.stopX();
    }
    if (this.x > this.canvas.width) {
      this.x = this.canvas.width;
      this.stopX();
    }
  }
}
