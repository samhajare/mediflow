import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, IsUUID, Length, Max, Min } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID() doctorId!: string;
  @IsUUID() patientId!: string;
  @IsDateString() startTime!: string;
  @IsOptional() @IsString() @Length(1, 500) reason?: string;
}

export class RescheduleAppointmentDto {
  @IsDateString() startTime!: string;
}

export class AppointmentQueryDto {
  @IsOptional() @IsUUID() doctorId?: string;
  @IsOptional() @IsUUID() patientId?: string;
  @IsOptional() @IsIn(['SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']) status?: string;
  @IsOptional() @IsDateString() from?: string;
  @IsOptional() @IsDateString() to?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 20;
}
