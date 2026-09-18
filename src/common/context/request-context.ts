import { AsyncLocalStorage } from 'node:async_hooks';
import { UserRole } from '../auth/user-role';

export interface RequestContext {
  requestId: string;
  correlationId: string;
  userId?: string;
  cognitoSub?: string;
  tenantId?: string;
  role?: UserRole;
  onboarding?: boolean;
}

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();

export function getRequestContext(): RequestContext | undefined {
  return requestContextStorage.getStore();
}

export function updateRequestContext(values: Partial<RequestContext>): void {
  const context = requestContextStorage.getStore();
  if (context) Object.assign(context, values);
}
