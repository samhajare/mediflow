import { Injectable } from '@nestjs/common';
import { getRequestContext } from '../../common/context/request-context';
import { AppError } from '../../common/errors/app-error';
import { DoctorSchedule } from '../../database/entities/doctor-schedule.entity';
import { CreateScheduleDto } from './schedule.dto';
import { SchedulesRepository } from './schedules.repository';
import { generateCandidateSlots } from './slot-generation';

const tenantId = (): string => {
  const value = getRequestContext()?.tenantId;
  if (!value) throw new AppError('USER_MEMBERSHIP_NOT_FOUND', 404, 'Doctor not found.');
  return value;
};
const dateIsValid = (date: string): boolean => {
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().startsWith(date);
};

@Injectable()
export class SchedulesService {
  constructor(private readonly repository: SchedulesRepository) {}

  private async doctor(id: string) {
    const result = await this.repository.findDoctor(tenantId(), id);
    if (!result) throw new AppError('DOCTOR_NOT_FOUND', 404, 'Doctor not found.');
    if (result.status !== 'ACTIVE') throw new AppError('DOCTOR_INACTIVE', 400, 'Doctor is inactive.');
    return result;
  }

  async create(doctorId: string, dto: CreateScheduleDto): Promise<DoctorSchedule> {
    await this.doctor(doctorId);
    const minutes = (value: string) => value.split(':').map(Number).reduce((hours, value, index) => index === 0 ? value * 60 : hours + value, 0);
    if (minutes(dto.startTime) >= minutes(dto.endTime)) throw new AppError('VALIDATION_ERROR', 400, 'Schedule start time must be before end time.');
    const tenant = tenantId();
    const existing = await this.repository.findActiveDay(tenant, doctorId, dto.dayOfWeek);
    const start = minutes(dto.startTime), end = minutes(dto.endTime);
    if (existing.some((schedule) => start < minutes(schedule.endTime) && end > minutes(schedule.startTime)))
      throw new AppError('DOCTOR_SCHEDULE_CONFLICT', 409, 'The schedule overlaps an existing active schedule.');
    return this.repository.save(this.repository.create({ tenantId: tenant, doctorId, dayOfWeek: dto.dayOfWeek, startTime: dto.startTime, endTime: dto.endTime, slotDurationMinutes: dto.slotDurationMinutes, status: 'ACTIVE' }));
  }

  async list(doctorId: string) { await this.doctor(doctorId); return { data: await this.repository.findSchedules(tenantId(), doctorId) }; }

  async availability(doctorId: string, date: string) {
    const doctor = await this.doctor(doctorId);
    if (!dateIsValid(date)) throw new AppError('VALIDATION_ERROR', 400, 'Date must be a valid calendar date.');
    const timezone = (await this.repository.findClinic(doctor.tenantId))?.timezone;
    if (!timezone) throw new AppError('CLINIC_NOT_FOUND', 404, 'Clinic not found.');
    const dayOfWeek = new Date(`${date}T12:00:00Z`).getUTCDay();
    const schedules = await this.repository.findActiveDay(doctor.tenantId, doctorId, dayOfWeek);
    const candidates = generateCandidateSlots(date, timezone, schedules);
    const occupied = await this.repository.findActiveAppointmentStarts(doctor.tenantId, doctorId, candidates[0]?.startTime ?? new Date(`${date}T00:00:00Z`), candidates[candidates.length - 1]?.endTime ?? new Date(`${date}T23:59:59Z`));
    const occupiedTimes = new Set(occupied.map((item) => new Date(item.startTime).getTime()));
    const slots = candidates.filter((slot) => !occupiedTimes.has(slot.startTime.getTime())).map((slot) => slot.startTime.toISOString());
    return { date, timezone, slots };
  }
}
