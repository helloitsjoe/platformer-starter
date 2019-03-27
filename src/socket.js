import io from 'socket.io-client';

export default class Socket {
  constructor(hero, window, port) {
    const url = port && `http://localhost:${port}`;
    this.hero = hero;
    this.socket = io(url);
    this.socket.on('connected', () => console.log('connected!'));
    this.socket.on('relay-tapDown', this.handleTapDown.bind(this));
    this.socket.on('relay-tapUp', this.handleTapUp.bind(this));

    this.tapDownMap = {
      button: this.hero.jump,
      padLeft: this.hero.moveLeft,
      padRight: this.hero.moveRight,
    };

    this.tapUpMap = {
      button: this.hero.cancelJump,
      padLeft: this.hero.stopX,
      padRight: this.hero.stopX,
    };
  }

  handleTapDown(command) {
    const func = this.tapDownMap[command];
    if (func) {
      func();
      this.socket.emit('handled');
    } else {
      console.log(`No tapDown handler for ${func}`);
    }
  }

  handleTapUp(command) {
    const func = this.tapUpMap[command];
    if (func) {
      func();
      this.socket.emit('handled');
    } else {
      console.log(`No tapUp handler for ${func}`);
    }
  }
}
