const V = 5;

export class Keyboard {
  constructor(window, hero) {
    this.hero = hero;
    window.addEventListener('keydown', this.handleKeydown.bind(this));
    window.addEventListener('keyup', this.handleKeyup.bind(this));
  }

  handleKeydown(e) {
    switch (e.code) {
      case 'ArrowLeft':
        this.hero.vx = V * -1;
        break;
      case 'ArrowRight':
        this.hero.vx = V;
        break;
      case 'Space':
        this.hero.vy = -V * 3;
        break;
      default:
        console.log(`e.code:`, e.code);
    }
  }

  handleKeyup(e) {
    switch (e.code) {
      case 'ArrowLeft':
      case 'ArrowRight':
        this.hero.vx = 0;
        break;
      default:
        console.log(`e.code:`, e.code);
    }
  }
}
