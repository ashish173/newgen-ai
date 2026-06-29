import { describe, it, expect, vi } from 'vitest';
import * as mailer from '../../src/lib/mailer';

describe('mailer', () => {
  it('sends email with attachment using mocked transport', async () => {
    const sendMail = vi.fn().mockResolvedValue({ messageId: '123' });
    (mailer as any).transport.sendMail = sendMail;
    const buf = Buffer.from('test');
    const info = await mailer.sendQuotationEmail({ to: 'a@b.com', subject: 'Test', text: 'hi', attachmentBuffer: buf, filename: 'a.txt' });
    expect(info.messageId).toBe('123');
    expect(sendMail).toHaveBeenCalled();
  });
});
