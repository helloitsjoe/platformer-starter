export default class Keyboard {
  constructor(hero, window) {
    this.hero = hero;
    window.addEventListener('keydown', this.handleKeydown.bind(this));
    window.addEventListener('keyup', this.handleKeyup.bind(this));
  }

  handleKeydown(e) {
    switch (e.code) {
      case 'ArrowLeft':
        this.hero.moveLeft();
        break;
      case 'ArrowRight':
        this.hero.moveRight();
        break;
      case 'Space':
        this.hero.jump();
        break;
      default:
        console.log(`e.code:`, e.code);
    }
  }

  handleKeyup(e) {
    switch (e.code) {
      case 'ArrowLeft':
      case 'ArrowRight':
        this.hero.stopX();
        break;
      default:
        console.log(`e.code:`, e.code);
    }
  }
}
