import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { json, unauthorized, notFound, badRequest } from '@/lib/http';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();
  const id = Number(params.id);
  const q = await prisma.quotation.findUnique({ where: { id }, include: { items: true, lead: true } });
  if (!q) return notFound();
  return json(q);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();
  const id = Number(params.id);
  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid');

  // transitions: send, approve, reject, revise
  if (body.action === 'send') {
    const q = await prisma.quotation.update({ where: { id }, data: { status: 'SENT', sentAt: new Date() } });
    return json(q);
  }
  if (body.action === 'approve') {
    const q = await prisma.quotation.update({ where: { id }, data: { status: 'APPROVED', approvedAt: new Date() } });
    return json(q);
  }
  if (body.action === 'reject') {
    const q = await prisma.quotation.update({ where: { id }, data: { status: 'REJECTED' } });
    return json(q);
  }
  if (body.action === 'revise') {
    const old = await prisma.quotation.findUnique({ where: { id } });
    if (!old) return notFound();
    const next = await prisma.quotation.create({ data: { leadId: old.leadId, version: (old.version || 1) + 1, status: 'DRAFT', total: old.total } });
    return json(next, 201);
  }

  return badRequest('Unknown action');
}
