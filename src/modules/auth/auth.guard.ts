import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AppError, ErrorCode } from '../../common/errors/app-error';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const header = request.header('authorization');
    if (!header || !/^Bearer\s+\S+$/i.test(header))
      throw new AppError(
        ErrorCode.UNAUTHENTICATED,
        401,
        'Authentication is required.',
      );
    await this.authService.authenticate(header.replace(/^Bearer\s+/i, ''));
    return true;
  }
}
