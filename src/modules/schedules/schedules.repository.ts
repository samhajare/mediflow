import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from '../../database/entities/clinic.entity';
import { Doctor } from '../../database/entities/doctor.entity';
import { DoctorSchedule } from '../../database/entities/doctor-schedule.entity';

@Injectable()
export class SchedulesRepository {
  constructor(
    @InjectRepository(Clinic) private readonly clinics: Repository<Clinic>,
    @InjectRepository(Doctor) private readonly doctors: Repository<Doctor>,
    @InjectRepository(DoctorSchedule) private readonly schedules: Repository<DoctorSchedule>,
  ) {}
  findClinic(id: string) { return this.clinics.findOne({ where: { id } }); }
  findDoctor(tenantId: string, id: string) { return this.doctors.findOne({ where: { tenantId, id } }); }
  findSchedules(tenantId: string, doctorId: string) { return this.schedules.find({ where: { tenantId, doctorId }, order: { dayOfWeek: 'ASC', startTime: 'ASC' } }); }
  findActiveDay(tenantId: string, doctorId: string, dayOfWeek: number) { return this.schedules.find({ where: { tenantId, doctorId, dayOfWeek, status: 'ACTIVE' }, order: { startTime: 'ASC' } }); }
  create(values: Partial<DoctorSchedule>) { return this.schedules.create(values); }
  save(schedule: DoctorSchedule) { return this.schedules.save(schedule); }
}
