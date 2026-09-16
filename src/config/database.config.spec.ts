import { databaseOptions } from './database.config';

describe('database configuration', () => {
  const original = process.env;
  beforeEach(() => {
    process.env = {
      ...original,
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'test',
      DB_USERNAME: 'test',
      DB_PASSWORD: 'test-only',
    };
  });
  afterEach(() => {
    process.env = original;
  });
  it('requires a password without exposing its value', () => {
    delete process.env.DB_PASSWORD;
    expect(() => databaseOptions()).toThrow(
      'Missing required environment variable: DB_PASSWORD',
    );
  });
  it.each(['abc', '0', '65536', '5432.5'])(
    'rejects invalid port %s',
    (port) => {
      process.env.DB_PORT = port;
      expect(() => databaseOptions()).toThrow('DB_PORT must be an integer');
    },
  );
  it('disables automatic schema changes and migration execution', () => {
    expect(databaseOptions()).toMatchObject({
      type: 'postgres',
      port: 5432,
      synchronize: false,
      migrationsRun: false,
    });
  });
});
