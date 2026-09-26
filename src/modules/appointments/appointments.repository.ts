import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Appointment } from '../../database/entities/appointment.entity';

@Injectable()
export class AppointmentsRepository {
  constructor(@InjectRepository(Appointment) private readonly repository: Repository<Appointment>) {}
  create(manager: EntityManager, values: Partial<Appointment>) { return manager.getRepository(Appointment).create(values); }
  save(manager: EntityManager, appointment: Appointment) { return manager.getRepository(Appointment).save(appointment); }
  findActiveAt(tenantId: string, doctorId: string, startTime: Date) { return this.repository.findOne({ where: [{ tenantId, doctorId, startTime, status: 'SCHEDULED' }, { tenantId, doctorId, startTime, status: 'CONFIRMED' }] }); }
  findByTenantAndId(tenantId: string, id: string) { return this.repository.findOne({ where: { tenantId, id } }); }
  findPage(tenantId: string, query: { doctorId?: string; patientId?: string; status?: string; from?: string; to?: string; page: number; limit: number }) {
    const builder = this.repository.createQueryBuilder('appointment').where('appointment.tenantId = :tenantId', { tenantId });
    if (query.doctorId) builder.andWhere('appointment.doctorId = :doctorId', { doctorId: query.doctorId });
    if (query.patientId) builder.andWhere('appointment.patientId = :patientId', { patientId: query.patientId });
    if (query.status) builder.andWhere('appointment.status = :status', { status: query.status });
    if (query.from) builder.andWhere('appointment.startTime >= :from', { from: query.from });
    if (query.to) builder.andWhere('appointment.startTime <= :to', { to: query.to });
    return builder.orderBy('appointment.startTime', 'ASC').skip((query.page - 1) * query.limit).take(query.limit).getManyAndCount();
  }
}
