import { requestContextStorage } from '../../common/context/request-context';
import { Patient } from '../../database/entities/patient.entity';
import { PatientsRepository } from './patients.repository';
import { PatientsService } from './patients.service';

describe('PatientsService', () => {
  const patient = { id: '00000000-0000-0000-0000-000000000001', tenantId: 'tenant-1', firstName: 'Jane', lastName: 'Doe' } as Patient;
  const context = { requestId: 'r', correlationId: 'c', tenantId: 'tenant-1', role: 'RECEPTIONIST' as never };
  function setup() {
    const repository = {
      create: jest.fn((values: Partial<Patient>) => values as Patient),
      save: jest.fn().mockResolvedValue(patient),
      findByTenantAndId: jest.fn().mockResolvedValue(patient),
      findPage: jest.fn().mockResolvedValue([[patient], 1]),
    } as unknown as PatientsRepository;
    return { service: new PatientsService(repository), repository };
  }

  it('creates a patient using the trusted tenant', async () => {
    const { service, repository } = setup();
    await requestContextStorage.run(context, () => service.create({ firstName: ' Jane ', lastName: ' Doe ', email: 'jane@example.com' }));
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ tenantId: 'tenant-1', status: 'ACTIVE', firstName: 'Jane', lastName: 'Doe' }));
  });

  it('uses database pagination and approved search', async () => {
    const { service, repository } = setup();
    await requestContextStorage.run(context, () => service.list({ page: 2, limit: 10, search: 'jane' }));
    expect(repository.findPage).toHaveBeenCalledWith('tenant-1', 2, 10, 'jane');
  });

  it('returns not found for a cross-tenant lookup', async () => {
    const { service, repository } = setup();
    (repository.findByTenantAndId as jest.Mock).mockResolvedValue(null);
    await expect(requestContextStorage.run(context, () => service.get(patient.id))).rejects.toMatchObject({ code: 'PATIENT_NOT_FOUND', statusCode: 404 });
  });
});
