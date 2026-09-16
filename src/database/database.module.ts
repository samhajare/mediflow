import { Module } from '@nestjs/common';
import {
  databaseOptions,
  loadDatabaseEnvironment,
} from '../config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        loadDatabaseEnvironment();
        return databaseOptions();
      },
    }),
  ],
})
export class DatabaseModule {}
