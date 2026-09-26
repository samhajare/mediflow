import { DataSource, EntityManager } from 'typeorm';
import { requestContextStorage } from '../../common/context/request-context';
import { Clinic } from '../../database/entities/clinic.entity';
import { ClinicsRepository } from './clinics.repository';
import { ClinicsService } from './clinics.service';

describe('ClinicsService', () => {
  const clinic = { id: 'clinic-1', name: 'Smile', timezone: 'Asia/Kolkata' } as Clinic;

  function setup() {
    const repository = {
      findMembership: jest.fn().mockResolvedValue(null),
      createClinic: jest.fn().mockResolvedValue(clinic),
      createMembership: jest.fn().mockResolvedValue({}),
      findById: jest.fn().mockResolvedValue(clinic),
      saveClinic: jest.fn().mockResolvedValue(clinic),
    } as unknown as ClinicsRepository;
    const dataSource = {
      transaction: jest.fn(async (callback: (manager: EntityManager) => Promise<Clinic>) => callback({} as EntityManager)),
    } as unknown as DataSource;
    return { service: new ClinicsService(dataSource, repository), repository, dataSource };
  }

  it('creates clinic and first admin inside one transaction', async () => {
    const { service, repository, dataSource } = setup();
    await requestContextStorage.run(
      { requestId: 'r', correlationId: 'c', cognitoSub: 'sub-1', onboarding: true },
      () => service.create({ name: ' Smile ', email: 'owner@example.com', timezone: 'Asia/Kolkata' }),
    );
    expect(dataSource.transaction).toHaveBeenCalledTimes(1);
    expect(repository.createClinic).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ name: 'Smile' }));
    expect(repository.createMembership).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ cognitoSub: 'sub-1', tenantId: 'clinic-1', role: 'CLINIC_ADMIN', status: 'ACTIVE' }));
  });

  it('rejects an empty profile patch', async () => {
    const { service } = setup();
    await expect(service.updateMine({})).rejects.toMatchObject({ code: 'VALIDATION_ERROR', statusCode: 400 });
  });

  it('rejects an invalid timezone', async () => {
    const { service } = setup();
    await expect(service.updateMine({ timezone: 'not/a-timezone' })).rejects.toMatchObject({ code: 'VALIDATION_ERROR', statusCode: 400 });
  });
});
