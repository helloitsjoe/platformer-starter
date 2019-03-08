export default class Background {
  constructor({ canvas, color = 'black' } = {}) {
    this.canvas = canvas || document.createElement('canvas');
    this._color = color;
  }

  draw(ctx) {
    ctx.fillStyle = this._color;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
