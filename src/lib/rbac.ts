import { Role, Lead } from '@prisma/client';

export function requireRole(user: { role?: Role } | null, roles: Role[]) {
  if (!user || !user.role || !roles.includes(user.role)) {
    const err: any = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
}

export function canEditLead(user: { role?: Role } | null, lead: Lead) {
  if (!user?.role) return false;
  if (user.role === 'BACK_OFFICE' || user.role === 'SALESPERSON') return true;
  return false;
}
