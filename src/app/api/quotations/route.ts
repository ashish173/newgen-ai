import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { json, unauthorized, badRequest } from '@/lib/http';
import { QuotationSchema } from '@/lib/schemas';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();
  const qs = await prisma.quotation.findMany({ include: { items: true, lead: true } });
  return json(qs);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();
  const body = await request.json().catch(() => null);
  const parsed = QuotationSchema.safeParse(body);
  if (!parsed.success) return badRequest('Invalid payload');
  const { leadId, items } = parsed.data;
  const total = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
  const q = await prisma.quotation.create({ data: { leadId, total, items: { create: items } } });
  return json(q, 201);
}
