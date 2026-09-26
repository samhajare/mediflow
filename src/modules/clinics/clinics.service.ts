import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { getRequestContext } from '../../common/context/request-context';
import { AppError } from '../../common/errors/app-error';
import { Clinic } from '../../database/entities/clinic.entity';
import { CreateClinicDto, UpdateClinicDto } from './clinic.dto';
import { ClinicsRepository } from './clinics.repository';

const validTimezone = (timezone: string): boolean => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format();
    return true;
  } catch {
    return false;
  }
};

@Injectable()
export class ClinicsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly clinicsRepository: ClinicsRepository,
  ) {}

  async create(dto: CreateClinicDto): Promise<Clinic> {
    const context = getRequestContext();
    if (!context?.cognitoSub || context.onboarding !== true)
      throw new AppError('FORBIDDEN', 403, 'Clinic onboarding is not available for this account.');
    if (!validTimezone(dto.timezone))
      throw new AppError('VALIDATION_ERROR', 400, 'Timezone must be a valid IANA timezone.');
    const name = dto.name.trim();
    if (!name) throw new AppError('VALIDATION_ERROR', 400, 'Name must not be empty.');

    return this.dataSource.transaction(async (manager) => {
      const existing = await this.clinicsRepository.findMembership(manager, context.cognitoSub);
      if (existing) throw new AppError('CONFLICT', 409, 'This account already has a clinic membership.');
      const savedClinic = await this.clinicsRepository.createClinic(manager, {
        name,
        email: dto.email ?? null,
        phone: dto.phone ?? null,
        timezone: dto.timezone,
      });
      await this.clinicsRepository.createMembership(manager, {
        cognitoSub: context.cognitoSub,
        tenantId: savedClinic.id,
        email: dto.email ?? `${context.cognitoSub}@invalid.local`,
        role: 'CLINIC_ADMIN',
        status: 'ACTIVE',
      });
      return savedClinic;
    });
  }

  async getMine(): Promise<Clinic> {
    const tenantId = getRequestContext()?.tenantId;
    if (!tenantId) throw new AppError('USER_MEMBERSHIP_NOT_FOUND', 404, 'Clinic not found.');
    const clinic = await this.clinicsRepository.findById(tenantId);
    if (!clinic) throw new AppError('CLINIC_NOT_FOUND', 404, 'Clinic not found.');
    return clinic;
  }

  async updateMine(dto: UpdateClinicDto): Promise<Clinic> {
    if (Object.keys(dto).length === 0)
      throw new AppError('VALIDATION_ERROR', 400, 'At least one clinic field is required.');
    const clinic = await this.getMine();
    if (dto.timezone !== undefined && !validTimezone(dto.timezone))
      throw new AppError('VALIDATION_ERROR', 400, 'Timezone must be a valid IANA timezone.');
    Object.assign(clinic, { ...dto, ...(dto.name === undefined ? {} : { name: dto.name.trim() }) });
    if (!clinic.name) throw new AppError('VALIDATION_ERROR', 400, 'Name must not be empty.');
    return this.clinicsRepository.saveClinic(clinic);
  }
}
