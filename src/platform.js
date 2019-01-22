export default class Platform {
  constructor({ x, y, width, height } = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export const makePlatform = ({
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
