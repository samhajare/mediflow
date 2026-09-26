import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Appointment } from '../../database/entities/appointment.entity';
import { Clinic } from '../../database/entities/clinic.entity';
import { Doctor } from '../../database/entities/doctor.entity';
import { DoctorSchedule } from '../../database/entities/doctor-schedule.entity';
import { Patient } from '../../database/entities/patient.entity';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsRepository } from './appointments.repository';
import { AppointmentsService } from './appointments.service';
import { NotificationService } from './notification.service';

@Module({ imports: [TypeOrmModule.forFeature([Appointment, Clinic, Doctor, DoctorSchedule, Patient]), AuthModule], controllers: [AppointmentsController], providers: [AppointmentsRepository, AppointmentsService, NotificationService] })
export class AppointmentsModule {}
