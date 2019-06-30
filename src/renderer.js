export const TILE_SIZE = 128;

export default class Renderer {
  constructor({ color = 'white', width, height } = {}) {
    this._color = color;
    this.width = width;
    this.height = height;
    this.tileW = null;
    this.tileH = null;
    this.tick = 0;
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

  // TODO: Maybe replace facingDirection with vx/vy
  draw({ ctx, facingDirection, x, y }) {
    this.tick++;
    this.drawImage({ ctx, facingDirection, x, y });
  }

  drawImage({ ctx, facingDirection = 1, x, y }) {
    if (!this.image) return;
    // Skull
    const skullSourceX = facingDirection > 0 ? 1 : 0;
    const skullSourceY = 0;
    ctx.drawImage(
      this.image,
      skullSourceX * this.tileW,
      skullSourceY * this.tileH,
      this.tileW,
      this.tileH,
      x,
      y,
      this.width,
      this.height
    );

    // Eyes
    // ctx.save();
    // ctx.globalAlpha = getAlpha(this.tick % 16);
    // console.log(`ctx.globalAlpha:`, ctx.globalAlpha);
    // const eyesSourceX = facingDirection > 0 ? 1 : 0;
    // const eyesSourceY = 1;
    // ctx.drawImage(
    //   this.image,
    //   eyesSourceX * this.tileW,
    //   eyesSourceY * this.tileH,
    //   this.tileW,
    //   this.tileH,
    //   x,
    //   y,
    //   this.width,
    //   this.height
    // );
    // ctx.restore();
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
