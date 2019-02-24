const GRAVITY = 0.7;
const VELOCITY = 5;

export default class Hero {
  constructor({ canvas, x, y } = {}) {
    this.canvas = canvas || document.createElement('canvas');
    this.x = x || this.canvas.width / 2;
    this.y = y || this.canvas.height;

    this.vx = 0;
    this.vy = 0;
    this.width = 20;
    this.height = 20;
    this._offsetX = this.width / 2;
    this._offsetY = this.height;
    this._marginX = this.width - (VELOCITY + 1);
  }

  jump() {
    this.vy = -VELOCITY * 3;
  }

  moveLeft() {
    this.vx = -VELOCITY;
  }

  moveRight() {
    this.vx = VELOCITY;
  }

  stopX() {
    this.vx = 0;
  }

  place({ x = this.x, y = this.y } = {}) {
    this.x = x;
    this.y = y;
  }

  update(platforms) {
    this.vy += GRAVITY;
    this.x += this.vx;
    this.y += this.vy;

    this._checkCollisions(platforms);
  }

  draw(ctx) {
    ctx.fillStyle = 'white';
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
    platforms.forEach(platform => {
      const isWithinPlatformX =
        this.getRight() > platform.getLeft() &&
        this.getLeft() < platform.getRight();
      const isWithinPlatformY =
        this.getBottom() > platform.getTop() &&
        this.getTop() < platform.getBottom();

      if (isWithinPlatformX && isWithinPlatformY) {
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
          this.vy = 0;
        }
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
