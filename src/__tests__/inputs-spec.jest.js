import io from 'socket.io-client';
import Hero from '../hero';
import Keyboard from '../keyboard';
import Socket from '../socket';
import { createServer } from '../../server/gameServer';

// Set up event listener to trigger
const eventMap = {};
window.addEventListener = jest.fn((event, cb) => {
  eventMap[event] = cb;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('keyboard', () => {
  it.each`
    key             | event        | method
    ${'Space'}      | ${'keydown'} | ${'jump'}
    ${'ArrowLeft'}  | ${'keydown'} | ${'moveLeft'}
    ${'ArrowRight'} | ${'keydown'} | ${'moveRight'}
    ${'ArrowLeft'}  | ${'keyup'}   | ${'stopX'}
    ${'ArrowRight'} | ${'keyup'}   | ${'stopX'}
  `('$key triggers $method', ({ key, event, method }) => {
    const hero = { [method]: jest.fn() };
    const keyboard = new Keyboard(hero, window);
    expect(hero[method]).toBeCalledTimes(0);
    eventMap[event]({ code: key });
    expect(hero[method]).toBeCalledTimes(1);
  });
});

describe.skip('socket', () => {
  const PORT = 1234;
  let server;
  let sender;

  beforeAll(() => {
    server = createServer(PORT);
  });

  beforeEach(done => {
    sender = io(`http://localhost:${PORT}`);
    sender.on('connected', () => {
      done();
    });
  });

  afterEach(() => {
    sender.disconnect();
  });

  afterAll(done => {
    server.close(done);
  });

  it('jumps', done => {
    const hero = { jump: jest.fn() };
    const socket = new Socket(hero, window, PORT);
    socket.socket.on('connected', () => {
      expect(hero.jump).toBeCalledTimes(0);
      sender.emit('tap');
      socket.socket.on('relay-tap', () => {
        expect(hero.jump).toBeCalledTimes(1);
        done();
      });
    });
  });
});
