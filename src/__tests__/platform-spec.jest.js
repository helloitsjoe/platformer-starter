import Platform, {
  makeRandomPlatform,
  createPlatforms,
  DEFAULT_PLATFORM_HEIGHT,
  DEFAULT_PLATFORM_WIDTH,
  DEFAULT_PLATFORMS,
} from '../platform';

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

  it('platform.place({ x, y }) teleports platform to x, y', () => {
    const options = { x: 100, y: 100, height: 50, width: 200 };
    const plat = new Platform(options);
    plat.place({ x: 42, y: 256 });
    expect(plat.x).toBe(42);
    expect(plat.y).toBe(256);
  });

  it('platform.place() uses previous value if x or y is undefined', () => {
    const options = { x: 100, y: 100, height: 50, width: 200 };
    const plat = new Platform(options);
    plat.place({ x: 42 });
    expect(plat.x).toBe(42);
    expect(plat.y).toBe(100);
    plat.place({ y: 128 });
    expect(plat.x).toBe(42);
    expect(plat.y).toBe(128);
    plat.place();
    expect(plat.x).toBe(42);
    expect(plat.y).toBe(128);
  });
});

describe('createPlatforms()', () => {
  it('first platform is ground', () => {
    const canvas = document.createElement('canvas');
    const [ground] = createPlatforms({ canvas });
    expect(ground.getBottom()).toBe(canvas.height);
    expect(ground.getTop()).toBe(canvas.height - DEFAULT_PLATFORM_HEIGHT);
    expect(ground.getLeft()).toBe(0);
    expect(ground.getRight()).toBe(canvas.width);
  });

  it('creates n platforms plus ground', () => {
    const num = 7;
    const platforms = createPlatforms({ num });
    // TEMP: Adding an extra platform for left/right testing
    expect(platforms.length).toBe(num + 1 + 1);
  });

  it('creates default number of platforms plus ground', () => {
    const platforms = createPlatforms();
    // TEMP: Adding an extra platform for left/right testing
    expect(platforms.length).toBe(DEFAULT_PLATFORMS + 1 + 1);
  });
});

describe('makeRandomPlatform()', () => {
  it('makeRandomPlatform creates platform on screen', () => {
    const options = { maxX: 200, maxY: 200, width: 20, height: 10 };
    const plat = makeRandomPlatform(options);
    expect(plat.x).toBeGreaterThanOrEqual(0);
    expect(plat.y).toBeGreaterThanOrEqual(0);
    expect(plat.x + plat.width).toBeLessThanOrEqual(options.maxX);
    expect(plat.y + plat.height).toBeLessThanOrEqual(options.maxY);
  });

  it('makeRandomPlatform default width/height if none provided', () => {
    const options = { maxX: 1000, maxY: 800 };
    const plat = makeRandomPlatform(options);
    expect(plat.x).toBeGreaterThanOrEqual(0);
    expect(plat.y).toBeGreaterThanOrEqual(0);
    expect(plat.x + plat.width).toBeLessThanOrEqual(options.maxX);
    expect(plat.y + plat.height).toBeLessThanOrEqual(options.maxY);
  });

  xit('uses previous platform for min/max values', () => {});
});
