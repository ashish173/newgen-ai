import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { json, unauthorized, badRequest } from '@/lib/http';
import { PaymentFlagSchema } from '@/lib/schemas';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();
  const ps = await prisma.payment.findMany({});
  return json(ps);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();
  const body = await request.json().catch(() => null);
  const parsed = PaymentFlagSchema.safeParse(body);
  if (!parsed.success) return badRequest('Invalid payload');
  const p = await prisma.payment.create({ data: { ...parsed.data } });
  return json(p, 201);
}
