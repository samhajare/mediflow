import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Clinic } from '../../database/entities/clinic.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class ClinicsRepository {
  constructor(private readonly dataSource: DataSource) {}

  findById(id: string): Promise<Clinic | null> {
    return this.dataSource.getRepository(Clinic).findOne({ where: { id } });
  }

  createClinic(manager: EntityManager, values: Partial<Clinic>): Promise<Clinic> {
    return manager.save(manager.create(Clinic, values));
  }

  findMembership(manager: EntityManager, cognitoSub: string): Promise<User | null> {
    return manager.findOne(User, { where: { cognitoSub } });
  }

  createMembership(manager: EntityManager, values: Partial<User>): Promise<User> {
    return manager.save(manager.create(User, values));
  }

  saveClinic(clinic: Clinic): Promise<Clinic> {
    return this.dataSource.getRepository(Clinic).save(clinic);
  }
}
