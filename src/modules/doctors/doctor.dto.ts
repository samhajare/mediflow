import { Type } from 'class-transformer';
import { IsEmail, IsIn, IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreateDoctorDto {
  @IsString() @Length(1, 100) firstName!: string;
  @IsString() @Length(1, 100) lastName!: string;
  @IsEmail() @Length(1, 255) email!: string;
  @IsOptional() @IsString() @Length(1, 30) phone?: string;
  @IsString() @Length(1, 150) specialization!: string;
  @IsOptional() @IsString() @Length(1, 255) qualification?: string;
}

export class UpdateDoctorDto {
  @IsOptional() @IsString() @Length(1, 100) firstName?: string;
  @IsOptional() @IsString() @Length(1, 100) lastName?: string;
  @IsOptional() @IsEmail() @Length(1, 255) email?: string;
  @IsOptional() @IsString() @Length(1, 30) phone?: string;
  @IsOptional() @IsString() @Length(1, 150) specialization?: string;
  @IsOptional() @IsString() @Length(1, 255) qualification?: string;
}

export class UpdateDoctorStatusDto {
  @IsIn(['ACTIVE', 'INACTIVE']) status!: string;
}

export class DoctorPaginationDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 20;
}
