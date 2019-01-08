import io from 'socket.io-client';

export default class Socket {
  constructor(hero, window, port) {
    const url = port && `http://localhost:${port}`;
    this.hero = hero;
    this.socket = io(url);
    this.socket.on('connected', () => console.log('connected!'));
    this.socket.on('relay-tap', this.handleTap.bind(this));
  }

  handleTap(e) {
    console.log(`clicked! e:`, e);
    this.hero.jump();
  }
}
