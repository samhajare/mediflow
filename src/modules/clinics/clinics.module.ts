import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Clinic } from '../../database/entities/clinic.entity';
import { User } from '../../database/entities/user.entity';
import { ClinicsController } from './clinics.controller';
import { ClinicsService } from './clinics.service';
import { ClinicsRepository } from './clinics.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Clinic, User]), AuthModule],
  controllers: [ClinicsController],
  providers: [ClinicsService, ClinicsRepository],
})
export class ClinicsModule {}
