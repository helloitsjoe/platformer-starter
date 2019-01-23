const GRAVITY = 0.7;
const VELOCITY = 5;

export default class Hero {
  constructor({ canvas, x, y } = {}) {
    this.canvas = canvas || document.createElement('canvas');
    this.width = 20;
    this.height = 20;
    this.offsetX = this.width / 2;
    this.offsetY = this.height;
    this.x = x || this.canvas.width / 2;
    this.y = y || this.canvas.height;
    this.vx = 0;
    this.vy = 0;
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

  update(platforms) {
    this.vy += GRAVITY;
    this.x += this.vx;
    this.y += this.vy;

    this._checkCollisions(platforms);
  }

  draw(ctx) {
    ctx.fillStyle = 'white';
    ctx.fillRect(
      this.x - this.offsetX,
      this.y - this.offsetY,
      this.width,
      this.height
    );
  }

  _checkCollisions(platforms) {
    this._checkPlatformCollisions(platforms);
    this._checkWallCollisions();
  }

  _checkPlatformCollisions(platforms = []) {
    platforms.forEach(platform => {
      // TODO: Only check leading edge
      // TODO: Refactor to use top/bottom/leftSide/rightSide?
      const isWithinPlatformX =
        this.x + this.offsetX > platform.x &&
        this.x - this.offsetX < platform.x + platform.width;
      const isWithinPlatformY =
        this.y >= platform.y &&
        this.y - this.offsetY < platform.y + platform.height;

      if (isWithinPlatformX && isWithinPlatformY) {
        this.y = platform.y;
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
      this.vx *= -1;
    }
    if (this.x > this.canvas.width) {
      this.x = this.canvas.width;
      this.vx *= -1;
    }
  }
}
