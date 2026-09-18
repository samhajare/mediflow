import { UserRole } from '../../common/auth/user-role';

export interface VerifiedCognitoIdentity {
  sub: string;
  claims: Readonly<Record<string, unknown>>;
}

export interface AuthenticatedPrincipal {
  cognitoSub: string;
  userId?: string;
  tenantId?: string;
  role?: UserRole;
  onboarding: boolean;
}
