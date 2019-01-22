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

  update(ctx) {
    this.vy += GRAVITY;
    this.x += this.vx;
    this.y += this.vy;

    this.checkWallCollision();
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

  checkWallCollision() {
    if (this.y > this.canvas.height) {
      this.y = this.canvas.height;
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
