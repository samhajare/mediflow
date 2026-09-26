import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, QueryFailedError } from 'typeorm';
import { getRequestContext } from '../../common/context/request-context';
import { AppError } from '../../common/errors/app-error';
import { paginationMeta } from '../../common/pagination/pagination.types';
import { Appointment } from '../../database/entities/appointment.entity';
import { Clinic } from '../../database/entities/clinic.entity';
import { Doctor } from '../../database/entities/doctor.entity';
import { DoctorSchedule } from '../../database/entities/doctor-schedule.entity';
import { Patient } from '../../database/entities/patient.entity';
import { generateCandidateSlots } from '../schedules/slot-generation';
import { AppointmentQueryDto, CreateAppointmentDto, RescheduleAppointmentDto } from './appointment.dto';
import { AppointmentsRepository } from './appointments.repository';
import { NotificationService } from './notification.service';

const tenant = (): string => {
  const value = getRequestContext()?.tenantId;
  if (!value) throw new AppError('USER_MEMBERSHIP_NOT_FOUND', 404, 'Appointment not found.');
  return value;
};
const localDate = (value: Date, timezone: string): string => {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(value);
  const values = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
};

@Injectable()
export class AppointmentsService {
  constructor(private readonly dataSource: DataSource, private readonly appointments: AppointmentsRepository, private readonly notifications: NotificationService) {}

  private async slot(manager: EntityManager, doctorId: string, startTime: Date) {
    const tenantId = tenant();
    const doctor = await manager.getRepository(Doctor).findOne({ where: { tenantId, id: doctorId } });
    if (!doctor) throw new AppError('DOCTOR_NOT_FOUND', 404, 'Doctor not found.');
    if (doctor.status !== 'ACTIVE') throw new AppError('DOCTOR_INACTIVE', 400, 'Doctor is inactive.');
    const clinic = await manager.getRepository(Clinic).findOne({ where: { id: tenantId } });
    if (!clinic) throw new AppError('CLINIC_NOT_FOUND', 404, 'Clinic not found.');
    const patientDate = localDate(startTime, clinic.timezone);
    const day = new Date(`${patientDate}T12:00:00Z`).getUTCDay();
    const schedules = await manager.getRepository(DoctorSchedule).find({ where: { tenantId, doctorId, dayOfWeek: day, status: 'ACTIVE' } });
    const match = generateCandidateSlots(patientDate, clinic.timezone, schedules).find((candidate) => candidate.startTime.getTime() === startTime.getTime());
    if (!match) throw new AppError('APPOINTMENT_SLOT_UNAVAILABLE', 409, 'The selected appointment slot is not available.');
    return { doctor, endTime: match.endTime };
  }

  private async saveWithNotification(action: () => Promise<Appointment>): Promise<Appointment> {
    const appointment = await action();
    try { await this.notifications.appointmentCommitted(appointment); } catch { /* notification failure must not fail the committed appointment */ }
    return appointment;
  }

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const tenantId = tenant();
    return this.saveWithNotification(() => this.dataSource.transaction(async (manager) => {
      const patient = await manager.getRepository(Patient).findOne({ where: { tenantId, id: dto.patientId } });
      if (!patient) throw new AppError('PATIENT_NOT_FOUND', 404, 'Patient not found.');
      const startTime = new Date(dto.startTime);
      const { endTime } = await this.slot(manager, dto.doctorId, startTime);
      if (await this.appointments.findActiveAt(tenantId, dto.doctorId, startTime)) throw new AppError('APPOINTMENT_SLOT_UNAVAILABLE', 409, 'The selected appointment slot is no longer available.');
      const appointment = this.appointments.create(manager, { tenantId, doctorId: dto.doctorId, patientId: dto.patientId, startTime, endTime, reason: dto.reason ?? null, status: 'SCHEDULED', cancelledAt: null });
      try { return await this.appointments.save(manager, appointment); }
      catch (error) { if (this.isSlotConflict(error)) throw new AppError('APPOINTMENT_SLOT_UNAVAILABLE', 409, 'The selected appointment slot is no longer available.'); throw error; }
    }));
  }

  async list(query: AppointmentQueryDto) { const [data, total] = await this.appointments.findPage(tenant(), query); return { data, pagination: paginationMeta(query.page, query.limit, total) }; }
  async get(id: string) { const appointment = await this.appointments.findByTenantAndId(tenant(), id); if (!appointment) throw new AppError('APPOINTMENT_NOT_FOUND', 404, 'Appointment not found.'); return appointment; }

  async reschedule(id: string, dto: RescheduleAppointmentDto): Promise<Appointment> {
    const tenantId = tenant();
    return this.saveWithNotification(() => this.dataSource.transaction(async (manager) => {
      const appointment = await manager.getRepository(Appointment).findOne({ where: { tenantId, id } });
      if (!appointment) throw new AppError('APPOINTMENT_NOT_FOUND', 404, 'Appointment not found.');
      const startTime = new Date(dto.startTime);
      const { endTime } = await this.slot(manager, appointment.doctorId, startTime);
      if (startTime.getTime() !== appointment.startTime.getTime() && await this.appointments.findActiveAt(tenantId, appointment.doctorId, startTime)) throw new AppError('APPOINTMENT_SLOT_UNAVAILABLE', 409, 'The selected appointment slot is no longer available.');
      appointment.startTime = startTime; appointment.endTime = endTime;
      try { return await manager.getRepository(Appointment).save(appointment); }
      catch (error) { if (this.isSlotConflict(error)) throw new AppError('APPOINTMENT_SLOT_UNAVAILABLE', 409, 'The selected appointment slot is no longer available.'); throw error; }
    }));
  }

  async cancel(id: string): Promise<Appointment> { return this.saveWithNotification(async () => { const appointment = await this.get(id); appointment.status = 'CANCELLED'; appointment.cancelledAt = new Date(); return this.dataSource.getRepository(Appointment).save(appointment); }); }
  private isSlotConflict(error: unknown): boolean { return error instanceof QueryFailedError && (error as QueryFailedError & { driverError?: { code?: string; constraint?: string } }).driverError?.code === '23505' && (error as QueryFailedError & { driverError?: { constraint?: string } }).driverError?.constraint === 'appointments_active_slot_unique'; }
}
