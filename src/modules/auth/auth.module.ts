import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { CognitoJwtVerifier } from './cognito-jwt-verifier';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [CognitoJwtVerifier, AuthService, AuthGuard, RolesGuard],
  exports: [AuthService, AuthGuard, RolesGuard],
})
export class AuthModule {}
