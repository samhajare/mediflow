import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateClinicDto {
  @IsString()
  @Length(1, 150)
  name!: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 255)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  phone?: string;

  @IsString()
  @Length(1, 100)
  timezone!: string;
}

export class UpdateClinicDto {
  @IsOptional()
  @IsString()
  @Length(1, 150)
  name?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 255)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  timezone?: string;
}
