import { Type } from 'class-transformer';
import { IsDateString, IsEmail, IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreatePatientDto {
  @IsString() @Length(1, 100) firstName!: string;
  @IsString() @Length(1, 100) lastName!: string;
  @IsOptional() @IsString() @Length(1, 30) phone?: string;
  @IsOptional() @IsEmail() @Length(1, 255) email?: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
}

export class UpdatePatientDto {
  @IsOptional() @IsString() @Length(1, 100) firstName?: string;
  @IsOptional() @IsString() @Length(1, 100) lastName?: string;
  @IsOptional() @IsString() @Length(1, 30) phone?: string;
  @IsOptional() @IsEmail() @Length(1, 255) email?: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
}

export class PatientQueryDto {
  @IsOptional() @IsString() @Length(1, 100) search?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 20;
}
