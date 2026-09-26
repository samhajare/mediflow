import { Appointment } from '../../database/entities/appointment.entity';

export interface AppointmentNotification {
  appointmentId: string;
  status: string;
  startTime: Date;
}

export interface NotificationProvider {
  appointmentCommitted(notification: AppointmentNotification): Promise<void>;
}

export const toAppointmentNotification = (appointment: Appointment): AppointmentNotification => ({
  appointmentId: appointment.id,
  status: appointment.status,
  startTime: appointment.startTime,
});
