import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { requestContextStorage } from '../../common/context/request-context';
import { UserRole } from '../../common/auth/user-role';
import { ROLES_KEY } from '../../common/auth/roles.decorator';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const context = {
    getHandler: () => 'handler',
    getClass: () => 'class',
  } as unknown as ExecutionContext;
  it('allows a trusted matching role', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([UserRole.DOCTOR]),
    } as unknown as Reflector;
    expect(
      requestContextStorage.run(
        { requestId: 'r', correlationId: 'c', role: UserRole.DOCTOR },
        () => new RolesGuard(reflector).canActivate(context),
      ),
    ).toBe(true);
  });
  it('rejects a disallowed role', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([UserRole.DOCTOR]),
    } as unknown as Reflector;
    expect(() =>
      requestContextStorage.run(
        { requestId: 'r', correlationId: 'c', role: UserRole.RECEPTIONIST },
        () => new RolesGuard(reflector).canActivate(context),
      ),
    ).toThrow();
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      'handler',
      'class',
    ]);
  });
});
