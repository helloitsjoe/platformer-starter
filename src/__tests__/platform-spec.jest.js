import Platform, { makeRandomPlatform } from '../platform';

describe('platform', () => {
  it('draws platform', () => {
    const mockCtx = { fillStyle: '', fillRect: jest.fn() };
    const plat = new Platform();
    plat.draw(mockCtx);
    expect(mockCtx.fillStyle).toBe('red');
    expect(mockCtx.fillRect).toBeCalledTimes(1);
  });

  it('init with x, y, height, width', () => {
    const options = { x: 100, y: 100, height: 50, width: 200 };
    const plat = new Platform(options);
    expect(plat.x).toBe(options.x);
    expect(plat.y).toBe(options.y);
    expect(plat.height).toBe(options.height);
    expect(plat.width).toBe(options.width);
  });

  it('makeRandomPlatform creates platform on screen', () => {
    const options = { maxX: 200, maxY: 200, width: 20, height: 10 };
    const plat = makeRandomPlatform(options)();
    expect(plat.x).toBeGreaterThanOrEqual(0);
    expect(plat.y).toBeGreaterThanOrEqual(0);
    expect(plat.x + plat.width).toBeLessThanOrEqual(options.maxX);
    expect(plat.y + plat.height).toBeLessThanOrEqual(options.maxY);
  });

  it('makeRandomPlatform default width/height if none provided', () => {
    const options = { maxX: 1000, maxY: 800 };
    const plat = makeRandomPlatform(options)();
    expect(plat.x).toBeGreaterThanOrEqual(0);
    expect(plat.y).toBeGreaterThanOrEqual(0);
    expect(plat.x + plat.width).toBeLessThanOrEqual(options.maxX);
    expect(plat.y + plat.height).toBeLessThanOrEqual(options.maxY);
  });
});
