import { Role } from '@prisma/client';
import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function RoleGuard({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session as any)?.user?.role as Role | undefined;
  if (!role || !allow.includes(role)) return null;
  return <>{children}</>;
}
