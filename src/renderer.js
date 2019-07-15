export const TILE_SIZE = 128;

export default class Renderer {
  constructor({ width, height } = {}) {
    this.width = width;
    this.height = height;
    this.tileW = null;
    this.tileH = null;
    this.tick = 0;
  }

  getDrawImageParams({ srcX, srcY, x, y }) {
    return [
      this.image,
      srcX * this.tileW,
      srcY * this.tileH,
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
      // Depends on how to handle multiple srcs... multiple
      // renderers vs an array of images. Might not be an issue
      // if all images are on one spritesheet
      this.tileW = tileW;
      this.tileH = tileH;
    });
  }

  drawImage({ ctx, srcX, srcY, x, y }) {
    if (!this.image) return;

    this.tick++;
    ctx.drawImage(...this.getDrawImageParams({ srcX, srcY, x, y }));
  }

  drawRect({ ctx, color, x, y, width, height }) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  drawCircle({ ctx, color, x, y, radius }) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
