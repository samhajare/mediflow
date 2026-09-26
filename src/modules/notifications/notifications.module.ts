import { Module } from '@nestjs/common';
import { LogNotificationProvider } from './log-notification.provider';
import { NotificationService } from './notification.service';

@Module({ providers: [LogNotificationProvider, NotificationService], exports: [NotificationService] })
export class NotificationsModule {}
