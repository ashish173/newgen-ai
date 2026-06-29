import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { json, unauthorized, badRequest, notFound } from '@/lib/http';
import { upload } from '@/lib/uploads';
import { AttachmentKind } from '@prisma/client';

export const runtime = 'nodejs';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return unauthorized();
  const id = Number(params.id);
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return badRequest('Missing file');

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = file.type || 'application/octet-stream';

  // Save using Node fs (multer not directly usable with Web FormData in Next 14 route handlers)
  const path = await (await import('path')).default;
  const fs = await import('fs/promises');
  const uploadDir = path.join(process.cwd(), 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.bin`;
  const fullPath = path.join(uploadDir, filename);
  await fs.writeFile(fullPath, buffer);

  const lat = formData.get('lat') ? Number(formData.get('lat')) : undefined;
  const lng = formData.get('lng') ? Number(formData.get('lng')) : undefined;
  const capturedAt = formData.get('capturedAt') ? new Date(String(formData.get('capturedAt'))) : undefined;

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return notFound();

  const attachment = await prisma.attachment.create({
    data: {
      kind: AttachmentKind.LEAD_IMAGE,
      leadId: id,
      filePath: fullPath,
      mimeType,
      lat,
      lng,
      capturedAt,
      uploadedById: Number((session as any).user.id),
    },
  });

  return json(attachment, 201);
}
