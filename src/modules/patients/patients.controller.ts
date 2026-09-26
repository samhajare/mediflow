import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/auth/roles.decorator';
import { UserRole } from '../../common/auth/user-role';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreatePatientDto, PatientQueryDto, UpdatePatientDto } from './patient.dto';
import { PatientsService } from './patients.service';

@Controller('patients')
@UseGuards(AuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patients: PatientsService) {}
  @Post() @Roles(UserRole.CLINIC_ADMIN, UserRole.RECEPTIONIST)
  create(@Body() dto: CreatePatientDto) { return this.patients.create(dto).then((data) => ({ data })); }
  @Get() @Roles(UserRole.CLINIC_ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)
  list(@Query() query: PatientQueryDto) { return this.patients.list(query); }
  @Get(':patientId') @Roles(UserRole.CLINIC_ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)
  get(@Param('patientId', ParseUUIDPipe) id: string) { return this.patients.get(id).then((data) => ({ data })); }
  @Patch(':patientId') @Roles(UserRole.CLINIC_ADMIN, UserRole.RECEPTIONIST)
  update(@Param('patientId', ParseUUIDPipe) id: string, @Body() dto: UpdatePatientDto) { return this.patients.update(id, dto).then((data) => ({ data })); }
}
