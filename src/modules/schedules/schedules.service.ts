import { Injectable } from '@nestjs/common';
import { getRequestContext } from '../../common/context/request-context';
import { AppError } from '../../common/errors/app-error';
import { DoctorSchedule } from '../../database/entities/doctor-schedule.entity';
import { CreateScheduleDto } from './schedule.dto';
import { SchedulesRepository } from './schedules.repository';

const tenantId = (): string => {
  const value = getRequestContext()?.tenantId;
  if (!value) throw new AppError('USER_MEMBERSHIP_NOT_FOUND', 404, 'Doctor not found.');
  return value;
};
const minutes = (value: string): number => {
  const [hours, mins] = value.split(':').map(Number);
  return hours * 60 + mins;
};
const dateParts = (date: Date, timezone: string): Record<string, number> => {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  return Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, Number(part.value)]));
};
const localToUtc = (date: string, time: string, timezone: string): Date => {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const localAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  const observed = dateParts(new Date(localAsUtc), timezone);
  const observedAsUtc = Date.UTC(observed.year, observed.month - 1, observed.day, observed.hour, observed.minute, observed.second);
  return new Date(localAsUtc - (observedAsUtc - localAsUtc));
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
    const slots: string[] = [];
    for (const schedule of schedules) {
      for (let cursor = minutes(schedule.startTime); cursor + schedule.slotDurationMinutes <= minutes(schedule.endTime); cursor += schedule.slotDurationMinutes) {
        const hours = String(Math.floor(cursor / 60)).padStart(2, '0');
        const mins = String(cursor % 60).padStart(2, '0');
        slots.push(localToUtc(date, `${hours}:${mins}`, timezone).toISOString());
      }
    }
    return { date, timezone, slots };
  }
}
