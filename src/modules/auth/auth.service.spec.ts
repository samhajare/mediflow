import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import {
  getRequestContext,
  requestContextStorage,
} from '../../common/context/request-context';
import { UserRole } from '../../common/auth/user-role';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  function service(user: User | null): AuthService {
    const repository = {
      findOne: jest.fn().mockResolvedValue(user),
    } as unknown as Repository<User>;
    const verifier = {
      verify: jest.fn().mockResolvedValue({ sub: 'cognito-sub', claims: {} }),
    };
    return new AuthService(repository, verifier as never);
  }

  it('populates trusted tenant and role from active membership', async () => {
    const user = {
      id: 'user-1',
      cognitoSub: 'cognito-sub',
      tenantId: 'tenant-from-db',
      role: UserRole.DOCTOR,
      status: 'ACTIVE',
    } as User;
    const result = await requestContextStorage.run(
      { requestId: 'request-1', correlationId: 'correlation-1' },
      () => service(user).authenticate('token'),
    );
    expect(result).toMatchObject({
      userId: 'user-1',
      tenantId: 'tenant-from-db',
      role: UserRole.DOCTOR,
      onboarding: false,
    });
    expect(getRequestContext()).toBeUndefined();
  });

  it('returns onboarding state when identity has no membership', async () => {
    const result = await requestContextStorage.run(
      { requestId: 'request-2', correlationId: 'correlation-2' },
      () => service(null).authenticate('token'),
    );
    expect(result).toEqual({ cognitoSub: 'cognito-sub', onboarding: true });
  });

  it('rejects inactive membership', async () => {
    const user = {
      id: 'user-1',
      cognitoSub: 'cognito-sub',
      tenantId: 'tenant-1',
      role: UserRole.DOCTOR,
      status: 'INACTIVE',
    } as User;
    await expect(
      requestContextStorage.run(
        { requestId: 'request-3', correlationId: 'correlation-3' },
        () => service(user).authenticate('token'),
      ),
    ).rejects.toMatchObject({ code: 'FORBIDDEN', statusCode: 403 });
  });
});
