import { Injectable } from '@nestjs/common';
import { getRequestContext } from '../../common/context/request-context';
import { AppError } from '../../common/errors/app-error';
import { paginationMeta } from '../../common/pagination/pagination.types';
import { Patient } from '../../database/entities/patient.entity';
import { CreatePatientDto, PatientQueryDto, UpdatePatientDto } from './patient.dto';
import { PatientsRepository } from './patients.repository';

const tenant = (): string => {
  const value = getRequestContext()?.tenantId;
  if (!value) throw new AppError('USER_MEMBERSHIP_NOT_FOUND', 404, 'Patient not found.');
  return value;
};

@Injectable()
export class PatientsService {
  constructor(private readonly patients: PatientsRepository) {}

  async create(dto: CreatePatientDto): Promise<Patient> {
    const patient = this.patients.create({ ...dto, tenantId: tenant(), firstName: dto.firstName.trim(), lastName: dto.lastName.trim(), phone: dto.phone ?? null, email: dto.email ?? null, dateOfBirth: dto.dateOfBirth ?? null, status: 'ACTIVE' });
    if (!patient.firstName || !patient.lastName) throw new AppError('VALIDATION_ERROR', 400, 'Patient name must not be empty.');
    return this.patients.save(patient);
  }

  async list(query: PatientQueryDto) {
    const [data, total] = await this.patients.findPage(tenant(), query.page, query.limit, query.search?.trim());
    return { data, pagination: paginationMeta(query.page, query.limit, total) };
  }

  async get(id: string): Promise<Patient> {
    const patient = await this.patients.findByTenantAndId(tenant(), id);
    if (!patient) throw new AppError('PATIENT_NOT_FOUND', 404, 'Patient not found.');
    return patient;
  }

  async update(id: string, dto: UpdatePatientDto): Promise<Patient> {
    if (Object.keys(dto).length === 0) throw new AppError('VALIDATION_ERROR', 400, 'At least one patient field is required.');
    const patient = await this.get(id);
    Object.assign(patient, { ...dto, ...(dto.firstName === undefined ? {} : { firstName: dto.firstName.trim() }), ...(dto.lastName === undefined ? {} : { lastName: dto.lastName.trim() }) });
    if (!patient.firstName || !patient.lastName) throw new AppError('VALIDATION_ERROR', 400, 'Patient name must not be empty.');
    return this.patients.save(patient);
  }
}
