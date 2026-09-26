import { Injectable, Logger } from '@nestjs/common';
import { Appointment } from '../../database/entities/appointment.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  async appointmentCommitted(appointment: Appointment): Promise<void> {
    this.logger.log(`Appointment committed: ${appointment.id}`);
  }
}
