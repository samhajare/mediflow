import { requestContextStorage } from '../../common/context/request-context';
import { Doctor } from '../../database/entities/doctor.entity';
import { DoctorsRepository } from './doctors.repository';
import { DoctorsService } from './doctors.service';

describe('DoctorsService', () => {
  const doctor = { id: '00000000-0000-0000-0000-000000000001', tenantId: 'tenant-1', email: 'doctor@example.com' } as Doctor;
  function setup() {
    const repository = {
      create: jest.fn((values: Partial<Doctor>) => values as Doctor),
      save: jest.fn().mockResolvedValue(doctor),
      findByTenantAndId: jest.fn().mockResolvedValue(doctor),
      findPage: jest.fn().mockResolvedValue([[doctor], 1]),
    } as unknown as DoctorsRepository;
    return { service: new DoctorsService(repository), repository };
  }

  it('uses the trusted tenant for creation', async () => {
    const { service, repository } = setup();
    await requestContextStorage.run(
      { requestId: 'r', correlationId: 'c', tenantId: 'tenant-1', role: 'CLINIC_ADMIN' as never },
      () => service.create({ firstName: 'A', lastName: 'Doctor', email: 'doctor@example.com', specialization: 'Dental' }),
    );
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ tenantId: 'tenant-1', status: 'ACTIVE' }));
  });

  it('returns a tenant-scoped page', async () => {
    const { service, repository } = setup();
    await requestContextStorage.run(
      { requestId: 'r', correlationId: 'c', tenantId: 'tenant-1' },
      () => service.list({ page: 1, limit: 20 }),
    );
    expect(repository.findPage).toHaveBeenCalledWith('tenant-1', 1, 20);
  });

  it('rejects an empty update', async () => {
    const { service } = setup();
    await expect(service.update(doctor.id, {})).rejects.toMatchObject({ code: 'VALIDATION_ERROR' });
  });
});
