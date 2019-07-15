import Renderer, { TILE_SIZE } from '../renderer';

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
      const srcX = 0;
      const srcY = 0;
      const tileW = TILE_SIZE;
      const tileH = TILE_SIZE;
      const x = 0;
      const y = 0;
      const width = 40;
      const height = 40;
      const renderer = new Renderer({ width, height });

      const drawImageArgs = [mockImage, srcX, srcY, tileW, tileH, x, y, width, height];

      renderer.loadImage({ src: 'fake-src.png', image: mockImage, tileW, tileH });

      renderer.drawImage({ ctx: mockCtx, srcX, srcY, x, y });
      expect(mockCtx.drawImage).toBeCalledWith(...drawImageArgs);
    });

    it('drawImage does not call ctx.drawImage if !renderer.image', () => {
      const renderer = new Renderer();
      renderer.drawImage({ ctx: {} });
      expect(mockCtx.drawImage).not.toBeCalled();
    });
  });

  describe('drawRect', () => {
    it('draws rectangle', () => {
      const renderer = new Renderer();
      const x = 1;
      const y = 2;
      const width = 20;
      const height = 30;

      renderer.drawRect({ ctx: mockCtx, color: 'white', x, y, width, height });
      expect(mockCtx.fillStyle).toBe('white');
      expect(mockCtx.fillRect).toBeCalledWith(x, y, width, height);
    });
  });

  describe('drawCircle', () => {
    it('draws circle', () => {
      const renderer = new Renderer();
      const x = 0;
      const y = 1;
      const radius = 2;

      renderer.drawCircle({ ctx: mockCtx, color: 'red', x, y, radius });
      expect(mockCtx.fillStyle).toBe('red');
      expect(mockCtx.arc).toBeCalledWith(x, y, radius, 0, Math.PI * 2);
    });
  });
});
