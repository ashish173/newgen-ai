import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { LeadSchema } from '@/lib/schemas';
import { json, badRequest, unauthorized } from '@/lib/http';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  return json(leads);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();
  const body = await request.json().catch(() => null);
  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) return badRequest('Invalid payload');
  const lead = await prisma.lead.create({
    data: {
      ...parsed.data,
      createdById: Number((session as any).user.id),
    },
  });
  return json(lead, 201);
}
