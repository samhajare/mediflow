import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Clinic } from '../../database/entities/clinic.entity';
import { Doctor } from '../../database/entities/doctor.entity';
import { DoctorSchedule } from '../../database/entities/doctor-schedule.entity';
import { Appointment } from '../../database/entities/appointment.entity';
import { SchedulesController } from './schedules.controller';
import { SchedulesRepository } from './schedules.repository';
import { SchedulesService } from './schedules.service';

@Module({ imports: [TypeOrmModule.forFeature([Clinic, Doctor, DoctorSchedule, Appointment]), AuthModule], controllers: [SchedulesController], providers: [SchedulesRepository, SchedulesService] })
export class SchedulesModule {}
