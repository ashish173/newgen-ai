import { describe, it, expect } from 'vitest';
import { buildQuotationWorkbook } from '../../src/lib/excel';

describe('excel builder', () => {
  it('builds workbook with totals', async () => {
    const buf = await buildQuotationWorkbook({ id: 1, leadName: 'Acme', version: 1, total: 0 }, [
      { description: 'Item A', quantity: 2, unitPrice: 50 },
      { description: 'Item B', quantity: 1, unitPrice: 100 },
    ]);
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.byteLength).toBeGreaterThan(1000);
  });
});
