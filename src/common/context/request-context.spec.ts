import { requestContextStorage, getRequestContext } from './request-context';

describe('request context', () => {
  it('keeps context isolated per async execution', async () => {
    const first = requestContextStorage.run(
      { requestId: 'one', correlationId: 'one-c' },
      async () => {
        await Promise.resolve();
        return getRequestContext();
      },
    );
    const second = requestContextStorage.run(
      { requestId: 'two', correlationId: 'two-c' },
      async () => {
        await Promise.resolve();
        return getRequestContext();
      },
    );
    await expect(first).resolves.toEqual({
      requestId: 'one',
      correlationId: 'one-c',
    });
    await expect(second).resolves.toEqual({
      requestId: 'two',
      correlationId: 'two-c',
    });
  });
});
