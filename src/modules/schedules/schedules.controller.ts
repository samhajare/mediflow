import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/auth/roles.decorator';
import { UserRole } from '../../common/auth/user-role';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { AvailabilityQueryDto, CreateScheduleDto } from './schedule.dto';
import { SchedulesService } from './schedules.service';

@Controller('doctors/:doctorId')
@UseGuards(AuthGuard, RolesGuard)
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}
  @Post('schedules') @Roles(UserRole.CLINIC_ADMIN)
  create(@Param('doctorId', ParseUUIDPipe) id: string, @Body() dto: CreateScheduleDto) { return this.service.create(id, dto).then((data) => ({ data })); }
  @Get('schedules') @Roles(UserRole.CLINIC_ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)
  list(@Param('doctorId', ParseUUIDPipe) id: string) { return this.service.list(id); }
  @Get('availability') @Roles(UserRole.CLINIC_ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)
  availability(@Param('doctorId', ParseUUIDPipe) id: string, @Query() query: AvailabilityQueryDto) { return this.service.availability(id, query.date); }
}
