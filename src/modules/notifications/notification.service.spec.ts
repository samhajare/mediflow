import { Appointment } from '../../database/entities/appointment.entity';
import { NotificationService } from './notification.service';
import { NotificationProvider } from './notification.types';

describe('NotificationService', () => {
  const appointment = { id: 'appointment-1', status: 'SCHEDULED', startTime: new Date('2026-09-21T03:30:00.000Z') } as Appointment;

  it('delegates a safe notification payload to the provider', async () => {
    const provider: NotificationProvider = { appointmentCommitted: jest.fn().mockResolvedValue(undefined) };
    await new NotificationService(provider).appointmentCommitted(appointment);
    expect(provider.appointmentCommitted).toHaveBeenCalledWith({ appointmentId: appointment.id, status: appointment.status, startTime: appointment.startTime });
  });

  it('catches provider failure without throwing', async () => {
    const provider: NotificationProvider = { appointmentCommitted: jest.fn().mockRejectedValue(new Error('provider unavailable')) };
    await expect(new NotificationService(provider).appointmentCommitted(appointment)).resolves.toBeUndefined();
  });
});
