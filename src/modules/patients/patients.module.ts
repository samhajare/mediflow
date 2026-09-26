import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Patient } from '../../database/entities/patient.entity';
import { PatientsController } from './patients.controller';
import { PatientsRepository } from './patients.repository';
import { PatientsService } from './patients.service';

@Module({ imports: [TypeOrmModule.forFeature([Patient]), AuthModule], controllers: [PatientsController], providers: [PatientsRepository, PatientsService] })
export class PatientsModule {}
