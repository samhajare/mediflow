import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getRequestContext } from '../../common/context/request-context';
import { ROLES_KEY } from '../../common/auth/roles.decorator';
import { UserRole } from '../../common/auth/user-role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;
    const role = getRequestContext()?.role;
    if (!role || !roles.includes(role))
      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      );
    return true;
  }
}
