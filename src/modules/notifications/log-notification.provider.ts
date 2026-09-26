import { Injectable, Logger } from '@nestjs/common';
import { AppointmentNotification, NotificationProvider } from './notification.types';

@Injectable()
export class LogNotificationProvider implements NotificationProvider {
  private readonly logger = new Logger(LogNotificationProvider.name);

  async appointmentCommitted(notification: AppointmentNotification): Promise<void> {
    this.logger.log({
      event: 'appointment_notification_simulated',
      appointmentId: notification.appointmentId,
      status: notification.status,
      startTime: notification.startTime.toISOString(),
    });
  }
}
