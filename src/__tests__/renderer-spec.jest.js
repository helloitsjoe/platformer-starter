import Renderer, { getAlpha, TILE_SIZE } from '../renderer';

const mockCtx = {
  fillStyle: '',
  arc: jest.fn(),
  fill: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  fillRect: jest.fn(),
  drawImage: jest.fn(),
  beginPath: jest.fn(),
};

describe('Renderer', () => {
  afterEach(jest.clearAllMocks);

  it('can set width/height', () => {
    const renderer = new Renderer();
    expect(renderer.width).toBe(undefined);
    expect(renderer.height).toBe(undefined);
    renderer.setWidth(4);
    renderer.setHeight(4);
    expect(renderer.width).toBe(4);
    expect(renderer.height).toBe(4);
  });

  it('draws image by default', () => {
    const renderer = new Renderer();
    renderer.loadImage({ src: 'fake' });
    renderer.drawImage = jest.fn();
    renderer.drawSquare = jest.fn();
    renderer.drawCircle = jest.fn();
    renderer.draw(mockCtx);
    expect(renderer.drawImage).toBeCalledTimes(1);
    expect(renderer.drawSquare).toBeCalledTimes(0);
    expect(renderer.drawCircle).toBeCalledTimes(0);
  });

  it('loadImage loads image with src', () => {
    const renderer = new Renderer();
    expect(renderer.image).toBe(undefined);
    const image = { onload: jest.fn() };
    renderer.loadImage({ src: 'fake-image.png', image });

    image.onload();
    expect(image.src).toBe('fake-image.png');
    expect(renderer.image).toEqual(image);
  });

  describe('drawImage()', () => {
    it('drawImage calls context.drawImage', () => {
      const mockImage = { onload: jest.fn() };
      const sourceX = 0;
      const sourceY = 0;
      const tileW = TILE_SIZE;
      const tileH = TILE_SIZE;
      const x = 0;
      const y = 0;
      const width = 40;
      const height = 40;
      const renderer = new Renderer({ width, height });

      const drawImageArgs = [mockImage, sourceX, sourceY, tileW, tileH, x, y, width, height];

      renderer.loadImage({ src: 'fake-src.png', image: mockImage, tileW, tileH });

      renderer.drawImage({ ctx: mockCtx, lookAt: -1, x, y });
      expect(mockCtx.drawImage).toBeCalledWith(...drawImageArgs);

      // Should offset to 2nd sprite
      const drawImageFlippedArgs = drawImageArgs.map((arg, i) => (i === 1 ? TILE_SIZE : arg));
      renderer.drawImage({ ctx: mockCtx, lookAt: 1, x, y });
      expect(mockCtx.drawImage).toBeCalledWith(...drawImageFlippedArgs);
    });

    it('drawImage does not call ctx.drawImage if !renderer.image', () => {
      const renderer = new Renderer();
      renderer.drawImage({ ctx: {} });
      expect(mockCtx.drawImage).not.toBeCalled();
    });

    it('drawImage calls drawSkull/drawEyes', () => {
      const renderer = new Renderer();
      renderer.loadImage({ src: 'fake-src.png', image: {} });
      renderer.drawSkull = jest.fn();
      renderer.drawEyes = jest.fn();
      renderer.drawImage({ ctx: {} });
      expect(renderer.drawSkull).toBeCalled();
      expect(renderer.drawEyes).toBeCalled();
    });
  });

  describe('drawSquare', () => {
    it('draws square', () => {
      const renderer = new Renderer();
      renderer.drawSquare(mockCtx);
      expect(mockCtx.fillStyle).toBe('white');
      expect(mockCtx.fillRect).toBeCalledTimes(1);
    });

    it('uses color if provided', () => {
      const renderer = new Renderer({ color: 'limegreen' });
      renderer.drawSquare(mockCtx);
      expect(mockCtx.fillStyle).toBe('limegreen');
    });
  });

  describe('drawCircle', () => {
    it('draws circle', () => {
      const renderer = new Renderer();
      renderer.drawCircle(mockCtx);
      expect(mockCtx.fillStyle).toBe('white');
      expect(mockCtx.arc).toBeCalledTimes(1);
    });

    it('uses color if provided', () => {
      const renderer = new Renderer({ color: 'limegreen' });
      renderer.drawCircle(mockCtx);
      expect(mockCtx.fillStyle).toBe('limegreen');
    });
  });
});

describe('getAlpha', () => {
  it.each`
    tick | alpha
    ${1} | ${0.5}
    ${2} | ${0.75}
    ${3} | ${1}
    ${4} | ${0.25}
  `('tick $tick is $alpha', ({ tick, alpha }) => {
  const ANIM_FACTOR = 4;
  expect(getAlpha(tick % ANIM_FACTOR, ANIM_FACTOR)).toBe(alpha);
});
});
