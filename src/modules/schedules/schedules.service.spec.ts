import { requestContextStorage } from '../../common/context/request-context';
import { DoctorSchedule } from '../../database/entities/doctor-schedule.entity';
import { SchedulesRepository } from './schedules.repository';
import { SchedulesService } from './schedules.service';

describe('SchedulesService', () => {
  const doctor = { tenantId: 'tenant-1', status: 'ACTIVE' };
  const context = { requestId: 'r', correlationId: 'c', tenantId: 'tenant-1', role: 'CLINIC_ADMIN' as never };
  function setup() {
    const repository = {
      findDoctor: jest.fn().mockResolvedValue(doctor),
      findActiveDay: jest.fn().mockResolvedValue([]),
      findSchedules: jest.fn().mockResolvedValue([]),
      findClinic: jest.fn().mockResolvedValue({ timezone: 'Asia/Kolkata' }),
      create: jest.fn((values: Partial<DoctorSchedule>) => values as DoctorSchedule),
      save: jest.fn().mockImplementation(async (value: DoctorSchedule) => value),
    } as unknown as SchedulesRepository;
    return { service: new SchedulesService(repository), repository };
  }

  it('allows adjacent windows but rejects overlap', async () => {
    const { service, repository } = setup();
    await requestContextStorage.run(context, () => service.create('doctor-1', { dayOfWeek: 1, startTime: '09:00', endTime: '10:00', slotDurationMinutes: 30 }));
    (repository.findActiveDay as jest.Mock).mockResolvedValue([{ startTime: '10:00', endTime: '11:00' }]);
    await expect(requestContextStorage.run(context, () => service.create('doctor-1', { dayOfWeek: 1, startTime: '11:00', endTime: '12:00', slotDurationMinutes: 30 }))).resolves.toBeDefined();
    await expect(requestContextStorage.run(context, () => service.create('doctor-1', { dayOfWeek: 1, startTime: '10:30', endTime: '11:30', slotDurationMinutes: 30 }))).rejects.toMatchObject({ code: 'DOCTOR_SCHEDULE_CONFLICT' });
  });

  it('generates timezone-independent UTC candidate slots', async () => {
    const { service, repository } = setup();
    (repository.findActiveDay as jest.Mock).mockResolvedValue([{ startTime: '09:00', endTime: '10:00', slotDurationMinutes: 30 }]);
    const result = await requestContextStorage.run(context, () => service.availability('doctor-1', '2026-09-21'));
    expect(result).toMatchObject({ date: '2026-09-21', timezone: 'Asia/Kolkata' });
    expect(result.slots).toEqual(['2026-09-21T03:30:00.000Z', '2026-09-21T04:00:00.000Z']);
  });
});
