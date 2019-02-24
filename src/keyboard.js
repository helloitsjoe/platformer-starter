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
      // Space: () => {}, // TODO: Cancel jump?
    };
  }

  handleKeydown(e) {
    const func = this.keyDownMap[e.code];
    return func ? func() : console.log(`No keydown handler for`, e.code);
  }

  handleKeyup(e) {
    const func = this.keyUpMap[e.code];
    return func ? func() : console.log(`No keyup handler for`, e.code);
  }
}
