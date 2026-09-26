import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/auth/roles.decorator';
import { UserRole } from '../../common/auth/user-role';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreateDoctorDto, DoctorPaginationDto, UpdateDoctorDto, UpdateDoctorStatusDto } from './doctor.dto';
import { DoctorsService } from './doctors.service';

@Controller('doctors')
@UseGuards(AuthGuard, RolesGuard)
export class DoctorsController {
  constructor(private readonly doctors: DoctorsService) {}

  @Post()
  @Roles(UserRole.CLINIC_ADMIN)
  create(@Body() dto: CreateDoctorDto) { return this.doctors.create(dto).then((data) => ({ data })); }

  @Get()
  @Roles(UserRole.CLINIC_ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)
  list(@Query() query: DoctorPaginationDto) { return this.doctors.list(query); }

  @Get(':doctorId')
  @Roles(UserRole.CLINIC_ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)
  get(@Param('doctorId', ParseUUIDPipe) id: string) { return this.doctors.get(id).then((data) => ({ data })); }

  @Patch(':doctorId')
  @Roles(UserRole.CLINIC_ADMIN)
  update(@Param('doctorId', ParseUUIDPipe) id: string, @Body() dto: UpdateDoctorDto) { return this.doctors.update(id, dto).then((data) => ({ data })); }

  @Patch(':doctorId/status')
  @Roles(UserRole.CLINIC_ADMIN)
  updateStatus(@Param('doctorId', ParseUUIDPipe) id: string, @Body() dto: UpdateDoctorStatusDto) { return this.doctors.updateStatus(id, dto).then((data) => ({ data })); }
}
