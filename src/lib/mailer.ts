import nodemailer from 'nodemailer';

function createTransport() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }
  // Dev: Ethereal
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: { user: 'ethereal_user', pass: 'ethereal_pass' },
  } as any);
}

export const transport = createTransport();

export async function sendQuotationEmail({
  to,
  subject,
  text,
  html,
  attachmentBuffer,
  filename,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachmentBuffer?: Buffer;
  filename?: string;
}) {
  const info = await transport.sendMail({
    from: 'no-reply@example.com',
    to,
    subject,
    text,
    html,
    attachments: attachmentBuffer && filename ? [{ filename, content: attachmentBuffer }] : [],
  });
  return info;
}
