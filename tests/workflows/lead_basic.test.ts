import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { PrismaClient, AttachmentKind } from '@prisma/client';
import { buildQuotationWorkbook } from '../../src/lib/excel';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('lead basic workflow', () => {
  it('creates lead -> quotation -> production -> installation', async () => {
    const user = await prisma.user.create({ data: { name: 'Test Sales', email: 'test@example.com', password_hash: 'x', role: 'SALESPERSON' } });
    const lead = await prisma.lead.create({ data: { customerName: 'Acme', contactPhone: '123', createdById: user.id } });
    await prisma.attachment.create({ data: { kind: AttachmentKind.LEAD_IMAGE, leadId: lead.id, filePath: '/tmp/x', mimeType: 'image/jpeg', uploadedById: user.id, lat: 1, lng: 2 } });

    const quotation = await prisma.quotation.create({ data: { leadId: lead.id, total: 150, items: { create: [ { description: 'Item', quantity: 3, unitPrice: 50 } ] } } });

    const buf = await buildQuotationWorkbook({ id: quotation.id, leadName: lead.customerName, version: quotation.version, total: quotation.total }, [ { description: 'Item', quantity: 3, unitPrice: 50 } ]);
    expect(Buffer.isBuffer(buf)).toBe(true);

    await prisma.payment.create({ data: { leadId: lead.id, quotationId: quotation.id, flag: 'PENDING' } });

    const approved = await prisma.quotation.update({ where: { id: quotation.id }, data: { status: 'APPROVED', approvedAt: new Date() } });
    expect(approved.status).toBe('APPROVED');

    const po = await prisma.productionOrder.create({ data: { quotationId: quotation.id, stage: 'BACK_OFFICE' } });
    const po2 = await prisma.productionOrder.update({ where: { id: po.id }, data: { stage: 'FACTORY' } });
    const po3 = await prisma.productionOrder.update({ where: { id: po.id }, data: { stage: 'DISPATCH' } });
    expect(po3.stage).toBe('DISPATCH');

    const team = await prisma.team.create({ data: { name: 'Installers', role: 'INSTALLATION' } });
    const task = await prisma.installationTask.create({ data: { productionOrderId: po.id, assignedTeamId: team.id } });
    await prisma.attachment.create({ data: { kind: AttachmentKind.INSTALL_PROOF, installTaskId: task.id, filePath: '/tmp/y', mimeType: 'image/jpeg', uploadedById: user.id } });
    const done = await prisma.installationTask.update({ where: { id: task.id }, data: { status: 'COMPLETED', completedAt: new Date() } });
    expect(done.status).toBe('COMPLETED');
  });
});
