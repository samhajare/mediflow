import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../../database/entities/doctor.entity';

@Injectable()
export class DoctorsRepository {
  constructor(@InjectRepository(Doctor) private readonly repository: Repository<Doctor>) {}

  create(values: Partial<Doctor>): Doctor { return this.repository.create(values); }
  save(doctor: Doctor): Promise<Doctor> { return this.repository.save(doctor); }
  findByTenantAndId(tenantId: string, id: string): Promise<Doctor | null> {
    return this.repository.findOne({ where: { tenantId, id } });
  }
  findPage(tenantId: string, page: number, limit: number): Promise<[Doctor[], number]> {
    return this.repository.findAndCount({ where: { tenantId }, order: { lastName: 'ASC', firstName: 'ASC' }, skip: (page - 1) * limit, take: limit });
  }
}
