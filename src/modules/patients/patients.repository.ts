import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Patient } from '../../database/entities/patient.entity';

@Injectable()
export class PatientsRepository {
  constructor(@InjectRepository(Patient) private readonly repository: Repository<Patient>) {}
  create(values: Partial<Patient>) { return this.repository.create(values); }
  save(patient: Patient) { return this.repository.save(patient); }
  findByTenantAndId(tenantId: string, id: string) { return this.repository.findOne({ where: { tenantId, id } }); }
  findPage(tenantId: string, page: number, limit: number, search?: string): Promise<[Patient[], number]> {
    const query = this.repository.createQueryBuilder('patient').where('patient.tenantId = :tenantId', { tenantId }).orderBy('patient.lastName', 'ASC').addOrderBy('patient.firstName', 'ASC').skip((page - 1) * limit).take(limit);
    if (search) query.andWhere(new Brackets((builder) => builder.where('patient.firstName ILIKE :search', { search: `%${search}%` }).orWhere('patient.lastName ILIKE :search', { search: `%${search}%` }).orWhere('patient.phone ILIKE :search', { search: `%${search}%` }).orWhere('patient.email ILIKE :search', { search: `%${search}%` })));
    return query.getManyAndCount();
  }
}
