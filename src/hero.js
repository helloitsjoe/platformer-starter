const GRAVITY = 0.7;
const VELOCITY = 5;

export default class Hero {
  constructor({ canvas, x, y } = {}) {
    this.canvas = canvas || document.createElement('canvas');
    this.width = 20;
    this.height = 20;
    this._offsetX = this.width / 2;
    this._offsetY = this.height;
    this.x = x || this.canvas.width / 2;
    this.y = y || this.canvas.height;
    this.vx = 0;
    this.vy = 0;
    this._bounds = {};
    this._updateBounds();
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

  move({ x = this.x, y = this.y }) {
    this.x = x;
    this.y = y;
    this._updateBounds();
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

  getBounds() {
    throw new Error('Use individual bounds getters instead.');
    // return this._bounds;
  }

  getTop() {
    return this._bounds.top;
  }

  getBottom() {
    return this._bounds.bottom;
  }

  getLeft() {
    return this._bounds.left;
  }

  getRight() {
    return this._bounds.right;
  }

  _updateBounds() {
    this._bounds = {
      bottom: this.y,
      top: this.y - this.height,
      left: this.x - this._offsetX,
      right: this.x + this._offsetX,
    };
  }

  _checkCollisions(platforms) {
    // update bounds before and after because
    // collisions can move position
    this._updateBounds();
    this._checkPlatformCollisions(platforms);
    this._checkWallCollisions();
    this._updateBounds();
  }

  _checkPlatformCollisions(platforms = []) {
    platforms.forEach(platform => {
      // TODO: Only check leading edge
      const isWithinPlatformX =
        this.getRight() > platform.getLeft() &&
        this.getLeft() < platform.getRight();
      const isWithinPlatformY =
        this.getBottom() >= platform.getTop() &&
        this.getTop() < platform.getBottom();

      if (isWithinPlatformX && isWithinPlatformY) {
        // if (this.vx >= 0) {
        //   if (this.getRight() < platform.getLeft() + VELOCITY + 1) {
        //     this.x = platform.getLeft() - this._offsetX;
        //   } else if (this.getLeft() > platform.getRight() - VELOCITY - 1) {
        //     this.x = platform.getRight() + this._offsetX;
        //   }
        //   this.vx = 0;
        // }

        // If hero collides with the bottom of a platform while
        // jumping, move top of hero to below bottom of platform
        if (this.vy < 0) {
          this.y = platform.getBottom() + this._offsetY;
        } else {
          this.y = platform.getTop();
        }
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
