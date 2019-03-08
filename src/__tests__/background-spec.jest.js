import Background from '../background';

let bg;
let canvas;

beforeEach(() => {
  canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 400;
  bg = new Background({ canvas });
});

it('draws background', () => {
  const mockCtx = { fillStyle: '', fillRect: jest.fn() };
  bg.draw(mockCtx);
  expect(mockCtx.fillStyle).toBe('black');
  expect(mockCtx.fillRect).toBeCalledWith(0, 0, canvas.width, canvas.height);
});

it('uses color if provided', () => {
  const bg2 = new Background({ color: 'limegreen' });
  const mockCtx = { fillStyle: '', fillRect: jest.fn() };
  bg2.draw(mockCtx);
  expect(mockCtx.fillStyle).toBe('limegreen');
});

it('creates canvas if none provided', () => {
  const bg2 = new Background();
  expect(bg2.canvas).toBeInstanceOf(HTMLCanvasElement);
});
