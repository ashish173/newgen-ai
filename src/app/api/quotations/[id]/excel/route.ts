import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { json, unauthorized, notFound } from '@/lib/http';
import { buildQuotationWorkbook } from '@/lib/excel';
import { sendQuotationEmail } from '@/lib/mailer';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();
  const id = Number(params.id);
  const q = await prisma.quotation.findUnique({ where: { id }, include: { items: true, lead: true } });
  if (!q) return notFound();
  const buf = await buildQuotationWorkbook({ id: q.id, leadName: q.lead.customerName, version: q.version, total: q.total }, q.items.map(i => ({ description: i.description, quantity: i.quantity, unitPrice: i.unitPrice })));
  return new Response(buf, { headers: { 'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'content-disposition': `attachment; filename=quotation-${q.id}.xlsx` } });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();
  const id = Number(params.id);
  const q = await prisma.quotation.findUnique({ where: { id }, include: { items: true, lead: true } });
  if (!q) return notFound();
  const buf = await buildQuotationWorkbook({ id: q.id, leadName: q.lead.customerName, version: q.version, total: q.total }, q.items.map(i => ({ description: i.description, quantity: i.quantity, unitPrice: i.unitPrice })));
  await sendQuotationEmail({ to: q.lead.contactEmail || 'customer@example.com', subject: `Quotation #${q.id}`, text: 'Please find attached quotation', attachmentBuffer: buf, filename: `quotation-${q.id}.xlsx` });
  return json({ ok: true });
}
