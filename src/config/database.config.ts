import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { join, resolve } from 'node:path';
import { DataSourceOptions } from 'typeorm';

export function loadDatabaseEnvironment(): void {
  const envPath = resolve(__dirname, '../../.env');
  if (existsSync(envPath)) loadEnvFile(envPath);
}

export function databaseOptions(): DataSourceOptions {
  const required = (key: string): string => {
    const value = process.env[key];
    if (!value?.trim())
      throw new Error(`Missing required environment variable: ${key}`);
    return value;
  };
  const rawPort = required('DB_PORT');
  const port = Number(rawPort);
  if (
    !/^\d+$/.test(rawPort) ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    throw new Error('DB_PORT must be an integer between 1 and 65535');
  }
  return {
    type: 'postgres',
    host: required('DB_HOST'),
    port,
    database: required('DB_NAME'),
    username: required('DB_USERNAME'),
    password: required('DB_PASSWORD'),
    entities: [join(__dirname, '../database/entities/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
    synchronize: false,
    migrationsRun: false,
  };
}
