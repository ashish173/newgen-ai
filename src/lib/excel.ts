import ExcelJS from 'exceljs';

export type QuoteItem = { description: string; quantity: number; unitPrice: number };
export type QuoteData = { id: number; leadName: string; version: number; total: number };

export async function buildQuotationWorkbook(quotation: QuoteData, items: QuoteItem[]) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Quotation');

  ws.columns = [
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Qty', key: 'quantity', width: 10 },
    { header: 'Unit Price', key: 'unitPrice', width: 15 },
    { header: 'Line Total', key: 'lineTotal', width: 15 },
  ];

  ws.addRow([`Quotation #${quotation.id} v${quotation.version} - ${quotation.leadName}`]);
  ws.addRow([]);

  let sum = 0;
  items.forEach((it) => {
    const line = it.quantity * it.unitPrice;
    sum += line;
    ws.addRow({ description: it.description, quantity: it.quantity, unitPrice: it.unitPrice, lineTotal: line });
  });

  ws.addRow([]);
  ws.addRow(['Total', '', '', sum]);

  const buf = await wb.xlsx.writeBuffer();
  return Buffer.from(buf);
}
