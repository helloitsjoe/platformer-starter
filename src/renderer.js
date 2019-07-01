export const TILE_SIZE = 128;

export function getAlpha(tick, speedFactor) {
  if (tick < speedFactor * 0.25) return 0.25;
  if (tick < speedFactor * 0.5) return 0.5;
  if (tick < speedFactor * 0.75) return 0.75;
  return 1;
}

export default class Renderer {
  constructor({ color = 'white', width, height } = {}) {
    this._color = color;
    this.width = width;
    this.height = height;
    this.tileW = null;
    this.tileH = null;
    this.tick = 0;
  }

  getDrawImageParams({ sourceX, sourceY, x, y }) {
    return [
      this.image,
      sourceX * this.tileW,
      sourceY * this.tileH,
      this.tileW,
      this.tileH,
      x,
      y,
      this.width,
      this.height,
    ];
  }

  setWidth(width) {
    this.width = width;
  }

  setHeight(height) {
    this.height = height;
  }

  loadImage({ src, tileW, tileH, image = new Image() }) {
    return new Promise(resolve => {
      this.image = image;
      this.image.onload = () => resolve();
      this.image.src = src;
      // TODO: Maybe assign tileW/H to image instead of renderer?
      // Depends on how to handle multiple sources... multiple
      // renderers vs an array of images. Might not be an issue
      // if all images are on one spritesheet
      this.tileW = tileW;
      this.tileH = tileH;
    });
  }

  // TODO: Maybe replace lookAt with vx/vy
  draw({ ctx, lookAt, x, y }) {
    this.tick++;
    this.drawImage({ ctx, lookAt, x, y });
  }

  drawImage({ ctx, lookAt, x, y }) {
    if (!this.image) return;

    this.drawSkull({ ctx, lookAt, x, y });
    this.drawEyes({ ctx, lookAt, x, y });
  }

  drawSkull({ ctx, lookAt, x, y }) {
    const sourceX = lookAt > 0 ? 1 : 0;
    const sourceY = 0;

    ctx.drawImage(...this.getDrawImageParams({ sourceX, sourceY, x, y }));
  }

  drawEyes({ ctx, lookAt, x, y }) {
    const ANIM_FACTOR = 32;
    ctx.save();
    ctx.globalAlpha = getAlpha(this.tick % ANIM_FACTOR, ANIM_FACTOR);

    const sourceX = lookAt > 0 ? 1 : 0;
    const sourceY = 1;

    ctx.drawImage(...this.getDrawImageParams({ sourceX, sourceY, x, y }));
    ctx.restore();
  }

  drawSquare(ctx, x, y) {
    ctx.fillStyle = this._color;
    ctx.fillRect(x, y, this.width, this.height);
  }

  drawCircle(ctx) {
    ctx.fillStyle = this._color;
    ctx.beginPath();
    ctx.arc(this.x, this.y - this._offsetY / 2, this._offsetX, 0, Math.PI * 2);
    ctx.fill();
  }
}
