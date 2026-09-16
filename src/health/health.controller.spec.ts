import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('reports liveness and readiness', () => {
    const controller = new HealthController();
    expect(controller.live()).toEqual({ status: 'ok' });
    expect(controller.ready()).toEqual({
      status: 'ok',
      scope: 'application',
      database: 'not_checked',
    });
  });
});
