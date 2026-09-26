import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/auth/roles.decorator';
import { UserRole } from '../../common/auth/user-role';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { AppointmentQueryDto, CreateAppointmentDto, RescheduleAppointmentDto } from './appointment.dto';
import { AppointmentsService } from './appointments.service';

@Controller('appointments') @UseGuards(AuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointments: AppointmentsService) {}
  @Post() @Roles(UserRole.CLINIC_ADMIN, UserRole.RECEPTIONIST)
  create(@Body() dto: CreateAppointmentDto) { return this.appointments.create(dto).then((data) => ({ data })); }
  @Get() @Roles(UserRole.CLINIC_ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)
  list(@Query() query: AppointmentQueryDto) { return this.appointments.list(query); }
  @Get(':appointmentId') @Roles(UserRole.CLINIC_ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)
  get(@Param('appointmentId', ParseUUIDPipe) id: string) { return this.appointments.get(id).then((data) => ({ data })); }
  @Patch(':appointmentId/reschedule') @Roles(UserRole.CLINIC_ADMIN, UserRole.RECEPTIONIST)
  reschedule(@Param('appointmentId', ParseUUIDPipe) id: string, @Body() dto: RescheduleAppointmentDto) { return this.appointments.reschedule(id, dto).then((data) => ({ data })); }
  @Patch(':appointmentId/cancel') @Roles(UserRole.CLINIC_ADMIN, UserRole.RECEPTIONIST)
  cancel(@Param('appointmentId', ParseUUIDPipe) id: string) { return this.appointments.cancel(id).then((data) => ({ data })); }
}
