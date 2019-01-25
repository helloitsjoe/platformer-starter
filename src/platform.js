export default class Platform {
  constructor({ x, y, width, height } = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this._bounds = {};
    this._updateBounds();
  }

  draw(ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  getBounds() {
    throw new Error('Use individual bounds getters instead.');
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

  move({ x = this.x, y = this.y }) {
    this.x = x;
    this.y = y;
    this._updateBounds();
  }

  _updateBounds() {
    this._bounds = {
      top: this.y,
      bottom: this.y + this.height,
      left: this.x,
      right: this.x + this.width,
    };
  }
}

export const makeRandomPlatform = ({
  maxX,
  maxY,
  width = 200,
  height = 30,
}) => each => {
  return new Platform({
    x: Math.floor(Math.random() * (maxX - width)),
    y: Math.floor(Math.random() * (maxY - height)),
    width,
    height,
  });
};
