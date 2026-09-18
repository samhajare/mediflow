import { AsyncLocalStorage } from 'node:async_hooks';
import { UserRole } from '../auth/user-role';

export interface RequestContext {
  requestId: string;
  correlationId: string;
  userId?: string;
  cognitoSub?: string;
  tenantId?: string;
  role?: UserRole;
}

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();

export function getRequestContext(): RequestContext | undefined {
  return requestContextStorage.getStore();
}
