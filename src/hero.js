export default class Hero {
  constructor(canvas) {
    this.width = 20;
    this.height = 20;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height;
    this.vx = 0;
    this.vy = 0;
  }
}
