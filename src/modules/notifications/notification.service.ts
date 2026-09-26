import { Inject, Injectable, Logger } from '@nestjs/common';
import { Appointment } from '../../database/entities/appointment.entity';
import { LogNotificationProvider } from './log-notification.provider';
import { NotificationProvider, toAppointmentNotification } from './notification.types';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  constructor(@Inject(LogNotificationProvider) private readonly provider: NotificationProvider) {}

  async appointmentCommitted(appointment: Appointment): Promise<void> {
    try {
      await this.provider.appointmentCommitted(toAppointmentNotification(appointment));
    } catch (error) {
      this.logger.error({
        event: 'appointment_notification_failed',
        appointmentId: appointment.id,
        error: error instanceof Error ? error.message : 'unknown',
      });
    }
  }
}
