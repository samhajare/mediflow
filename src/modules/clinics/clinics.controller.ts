import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../../common/auth/roles.decorator';
import { UserRole } from '../../common/auth/user-role';
import { CreateClinicDto, UpdateClinicDto } from './clinic.dto';
import { ClinicsService } from './clinics.service';

@Controller('clinics')
@UseGuards(AuthGuard)
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Post()
  create(@Body() dto: CreateClinicDto) {
    return this.clinicsService.create(dto).then((data) => ({ data }));
  }

  @Get('me')
  @Roles(UserRole.CLINIC_ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR)
  @UseGuards(RolesGuard)
  getMine() {
    return this.clinicsService.getMine().then((data) => ({ data }));
  }

  @Patch('me')
  @Roles(UserRole.CLINIC_ADMIN)
  @UseGuards(RolesGuard)
  updateMine(@Body() dto: UpdateClinicDto) {
    return this.clinicsService.updateMine(dto).then((data) => ({ data }));
  }
}
