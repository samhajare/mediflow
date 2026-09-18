import { INestApplication, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DatabaseModule } from '../src/database/database.module';
import { configureApp } from '../src/configure-app';
import { AuthModule } from '../src/modules/auth/auth.module';

@Module({})
class TestDatabaseModule {}

describe('Health HTTP endpoints (database boundary replaced)', () => {
  let app: INestApplication;
  let baseUrl: string;
  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideModule(DatabaseModule)
      .useModule(TestDatabaseModule)
      .overrideModule(AuthModule)
      .useModule(TestDatabaseModule)
      .compile();
    app = module.createNestApplication();
    configureApp(app);
    await app.listen(0, '127.0.0.1');
    baseUrl = await app.getUrl();
  });
  afterAll(async () => {
    await app?.close();
  });
  it('GET /health/live returns 200', async () => {
    const response = await fetch(`${baseUrl}/health/live`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok' });
  });
  it('GET /health/ready accurately reports application-only readiness', async () => {
    const response = await fetch(`${baseUrl}/health/ready`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: 'ok',
      scope: 'application',
      database: 'not_checked',
    });
  });
});
