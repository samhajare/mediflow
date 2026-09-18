import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppError, ErrorCode } from '../../common/errors/app-error';
import { updateRequestContext } from '../../common/context/request-context';
import { UserRole } from '../../common/auth/user-role';
import { User } from '../../database/entities/user.entity';
import { AuthenticatedPrincipal } from './auth.types';
import { CognitoJwtVerifier } from './cognito-jwt-verifier';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly verifier: CognitoJwtVerifier,
  ) {}

  async authenticate(token: string): Promise<AuthenticatedPrincipal> {
    let identity;
    try {
      identity = await this.verifier.verify(token);
    } catch {
      throw new AppError(
        ErrorCode.UNAUTHENTICATED,
        401,
        'Authentication is required.',
      );
    }
    const user = await this.users.findOne({
      where: { cognitoSub: identity.sub },
    });
    if (!user) {
      updateRequestContext({ cognitoSub: identity.sub, onboarding: true });
      return { cognitoSub: identity.sub, onboarding: true };
    }
    if (user.status !== 'ACTIVE')
      throw new AppError(
        ErrorCode.FORBIDDEN,
        403,
        'Your application membership is inactive.',
      );
    const role = user.role as UserRole;
    updateRequestContext({
      userId: user.id,
      cognitoSub: identity.sub,
      tenantId: user.tenantId,
      role,
      onboarding: false,
    });
    return {
      cognitoSub: identity.sub,
      userId: user.id,
      tenantId: user.tenantId,
      role,
      onboarding: false,
    };
  }
}
