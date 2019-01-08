import io from 'socket.io-client';

const V = 5;

export class Socket {
  constructor(window, hero) {
    this.hero = hero;
    this.socket = io();
    this.socket.on('connected', () => console.log('connected!'));
    this.socket.on('relay-tap', this.handleTap.bind(this));
  }

  handleTap(e) {
    console.log(`clicked! e:`, e);
    this.hero.vy = -V * 3;
  }
}
