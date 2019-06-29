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

  it('unhandled methods do not throw', () => {
    const hero = {};
    const keyboard = new Keyboard(hero, window);
    eventMap.keydown({ code: 'Poo' });
    eventMap.keyup({ code: 'Poo' });
  });

  it('space keyup cancels jump', () => {
    const hero = {
      jump: jest.fn(),
      cancelJump: jest.fn(),
    };
    const keyboard = new Keyboard(hero, window);
    eventMap.keydown({ code: 'Space' });
    eventMap.keyup({ code: 'Space' });
    expect(hero.cancelJump).toBeCalled();
  });

  it('keyup does not stop hero if the opposite key is down', () => {
    const hero = {
      moveRight: jest.fn(),
      stopX: jest.fn(),
      moveLeft: jest.fn(),
    };
    const keyboard = new Keyboard(hero, window);
    expect(hero.moveRight).toBeCalledTimes(0);
    expect(hero.moveLeft).toBeCalledTimes(0);
    expect(hero.stopX).toBeCalledTimes(0);
    eventMap.keydown({ code: 'ArrowLeft' });
    eventMap.keydown({ code: 'ArrowRight' });
    eventMap.keyup({ code: 'ArrowLeft' });
    expect(hero.moveRight).toBeCalledTimes(1);
    expect(hero.moveLeft).toBeCalledTimes(1);
    expect(hero.stopX).toBeCalledTimes(0);
    jest.clearAllMocks();
    eventMap.keydown({ code: 'ArrowRight' });
    eventMap.keydown({ code: 'ArrowLeft' });
    eventMap.keyup({ code: 'ArrowRight' });
    expect(hero.moveRight).toBeCalledTimes(1);
    expect(hero.moveLeft).toBeCalledTimes(1);
    expect(hero.stopX).toBeCalledTimes(0);
  });
});

describe('socket', () => {
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

  test.each`
    description             | eventName    | command       | func
    ${'jumps'}              | ${'tapDown'} | ${'button'}   | ${'jump'}
    ${'moves left'}         | ${'tapDown'} | ${'padLeft'}  | ${'moveLeft'}
    ${'moves right'}        | ${'tapDown'} | ${'padRight'} | ${'moveRight'}
    ${'cancels jump'}       | ${'tapUp'}   | ${'button'}   | ${'cancelJump'}
    ${'stops moving left'}  | ${'tapUp'}   | ${'padLeft'}  | ${'stopX'}
    ${'stops moving right'} | ${'tapUp'}   | ${'padRight'} | ${'stopX'}
  `('$description', ({ eventName, command, func }, done) => {
  // Silence console logs for these tests
  console.log = jest.fn();
  const hero = { [func]: jest.fn() };
  const socket = new Socket(hero, window, PORT);
  socket.socket.on('connected', () => {
    expect(hero[func]).toBeCalledTimes(0);
    sender.emit(eventName, command);
    sender.on('handled', () => {
      expect(hero[func]).toBeCalledTimes(1);
      done();
    });
  });
});
});
