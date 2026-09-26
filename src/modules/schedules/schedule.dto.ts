import { Type } from 'class-transformer';
import { IsIn, IsInt, IsMilitaryTime, IsOptional, IsString, Matches, Max, Min } from 'class-validator';

export class CreateScheduleDto {
  @Type(() => Number) @IsInt() @Min(0) @Max(6) dayOfWeek!: number;
  @IsMilitaryTime() startTime!: string;
  @IsMilitaryTime() endTime!: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) slotDurationMinutes = 30;
}

export class AvailabilityQueryDto {
  @IsString() @Matches(/^\d{4}-\d{2}-\d{2}$/) date!: string;
}
