export default class Keyboard {
  constructor(hero, window) {
    this.hero = hero;
    window.addEventListener('keydown', this.handleKeydown.bind(this));
    window.addEventListener('keyup', this.handleKeyup.bind(this));

    this.keyDownMap = {
      ArrowLeft: () => this.hero.moveLeft(),
      ArrowRight: () => this.hero.moveRight(),
      Space: () => this.hero.jump(),
    };

    this.keyUpMap = {
      ArrowLeft: () => this.hero.stopX(),
      ArrowRight: () => this.hero.stopX(),
    };
  }

  handleKeydown(e) {
    const maybeFunc = this.keyDownMap[e.code];
    if (typeof maybeFunc === 'function') {
      return maybeFunc();
    }
    // istanbul ignore next
    console.log(`No handler for`, e.code);
  }

  handleKeyup(e) {
    const maybeFunc = this.keyUpMap[e.code];
    if (typeof maybeFunc === 'function') {
      return maybeFunc();
    }
    // istanbul ignore next
    console.log(`No handler for`, e.code);
  }
}
