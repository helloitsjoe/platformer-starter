export const GRAVITY = 0.7;
export const VELOCITY = 5;
export const MAX_VX = 5;
export const MAX_VY = VELOCITY * 3;

export default class Hero {
  constructor({
    canvas,
    x,
    y,
    color = 'white',
    grounded = true,
    accelX = 0.75,
  } = {}) {
    this.canvas = canvas || document.createElement('canvas');
    this.x = x || this.canvas.width / 2;
    this.y = y || this.canvas.height;

    this.vx = 0;
    this.vy = 0;
    this.width = 20;
    this.height = 20;
    this._direction = 0;
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

  jump() {
    // FIXME: User can hold space and keep jumping
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
  }

  moveRight() {
    this._direction = 1;
  }

  stopX() {
    this._direction = 0;
    this.vx = 0;
  }

  place({ x = this.x, y = this.y } = {}) {
    this.x = x;
    this.y = y;
  }

  getVX() {
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
    ctx.fillStyle = this._color;
    // circle
    // ctx.beginPath();
    // ctx.arc(this.x, this.y - this._offsetY / 2, this._offsetX, 0, Math.PI * 2);
    // ctx.fill();

    // square
    ctx.fillRect(
      this.x - this._offsetX,
      this.y - this._offsetY,
      this.width,
      this.height
    );
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

      // This is janky, hero will slip off if very close to the edge.
      // Keep track of prev position instead?
      // OR updateX, checkX, updateY, checkY (see mario-lesson)
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
