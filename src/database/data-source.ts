import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  databaseOptions,
  loadDatabaseEnvironment,
} from '../config/database.config';
loadDatabaseEnvironment();
export default new DataSource(databaseOptions());
