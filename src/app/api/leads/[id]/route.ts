import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { json, unauthorized, notFound, badRequest } from '@/lib/http';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();
  const id = Number(params.id);
  const lead = await prisma.lead.findUnique({ where: { id }, include: { attachments: true, quotations: true } });
  if (!lead) return notFound();
  return json(lead);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();
  const id = Number(params.id);
  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid');
  const lead = await prisma.lead.update({ where: { id }, data: body });
  return json(lead);
}
