import { Injectable } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { getRequestContext } from '../../common/context/request-context';
import { AppError } from '../../common/errors/app-error';
import { paginationMeta } from '../../common/pagination/pagination.types';
import { Doctor } from '../../database/entities/doctor.entity';
import { CreateDoctorDto, DoctorPaginationDto, UpdateDoctorDto, UpdateDoctorStatusDto } from './doctor.dto';
import { DoctorsRepository } from './doctors.repository';

const tenant = (): string => {
  const tenantId = getRequestContext()?.tenantId;
  if (!tenantId) throw new AppError('USER_MEMBERSHIP_NOT_FOUND', 404, 'Doctor not found.');
  return tenantId;
};

@Injectable()
export class DoctorsService {
  constructor(private readonly doctors: DoctorsRepository) {}

  async create(dto: CreateDoctorDto): Promise<Doctor> {
    const doctor = this.doctors.create({ ...dto, tenantId: tenant(), phone: dto.phone ?? null, qualification: dto.qualification ?? null, userId: null, status: 'ACTIVE' });
    return this.save(doctor);
  }

  async list(query: DoctorPaginationDto) {
    const [data, total] = await this.doctors.findPage(tenant(), query.page, query.limit);
    return { data, pagination: paginationMeta(query.page, query.limit, total) };
  }

  async get(id: string): Promise<Doctor> {
    const doctor = await this.doctors.findByTenantAndId(tenant(), id);
    if (!doctor) throw new AppError('DOCTOR_NOT_FOUND', 404, 'Doctor not found.');
    return doctor;
  }

  async update(id: string, dto: UpdateDoctorDto): Promise<Doctor> {
    if (Object.keys(dto).length === 0) throw new AppError('VALIDATION_ERROR', 400, 'At least one doctor field is required.');
    const doctor = await this.get(id);
    Object.assign(doctor, dto);
    return this.save(doctor);
  }

  async updateStatus(id: string, dto: UpdateDoctorStatusDto): Promise<Doctor> {
    const doctor = await this.get(id);
    doctor.status = dto.status;
    return this.save(doctor);
  }

  private async save(doctor: Doctor): Promise<Doctor> {
    try { return await this.doctors.save(doctor); }
    catch (error) {
      if (error instanceof QueryFailedError && (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === '23505')
        throw new AppError('DOCTOR_EMAIL_ALREADY_EXISTS', 409, 'A doctor with this email already exists in this clinic.');
      throw error;
    }
  }
}
