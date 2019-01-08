const GRAVITY = 0.7;
const V = 5;

export default class Hero {
  constructor({ canvas, x, y } = {}) {
    this.width = 20;
    this.height = 20;
    this.canvas = canvas || document.createElement('canvas');
    this.x = x || this.canvas.width / 2 - this.width / 2;
    this.y = y || this.canvas.height - this.height;
    this.vx = 0;
    this.vy = 0;
  }

  jump() {
    this.vy = -V * 3;
  }

  moveLeft() {
    this.vx = -V;
  }

  moveRight() {
    this.vx = V;
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
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkWallCollision() {
    if (this.y + this.height > this.canvas.height) {
      this.y = this.canvas.height - this.height;
    }
    if (this.x < 0) {
      this.x = 0;
      this.vx *= -1;
    }
    if (this.x > this.canvas.width - this.height) {
      this.x = this.canvas.width - this.height;
      this.vx *= -1;
    }
  }
}
