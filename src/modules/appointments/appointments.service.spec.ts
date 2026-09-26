import { DataSource } from 'typeorm';
import { requestContextStorage } from '../../common/context/request-context';
import { AppointmentsRepository } from './appointments.repository';
import { AppointmentsService } from './appointments.service';
import { NotificationService } from './notification.service';

describe('AppointmentsService', () => {
  it('rejects a missing patient before booking', async () => {
    const manager = { getRepository: jest.fn().mockReturnValue({ findOne: jest.fn().mockResolvedValue(null) }) };
    const dataSource = { transaction: jest.fn((callback: (value: unknown) => Promise<unknown>) => callback(manager)) } as unknown as DataSource;
    const repository = {} as AppointmentsRepository;
    const notifications = {} as NotificationService;
    const service = new AppointmentsService(dataSource, repository, notifications);
    await expect(requestContextStorage.run({ requestId: 'r', correlationId: 'c', tenantId: 'tenant-1' }, () => service.create({ doctorId: '00000000-0000-0000-0000-000000000001', patientId: '00000000-0000-0000-0000-000000000002', startTime: '2026-09-21T03:30:00.000Z' }))).rejects.toMatchObject({ code: 'PATIENT_NOT_FOUND' });
  });
});
