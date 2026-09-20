import { LifeReceipt, LifeStats } from '../types/receipt';

/**
 * Multi-Format Export Suite for LifeReceipts
 * Supports JSON archives, universal CSV exports, and authentic 42-column ASCII thermal receipts.
 */

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Exports all loaded life receipts as a formatted JSON document.
 */
export function exportToJson(receipts: LifeReceipt[]): void {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '3.3.0',
    totalReceipts: receipts.length,
    receipts,
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  triggerDownload(blob, 'LifeReceipts_Archive.json');
}

/**
 * Exports all loaded life receipts as a CSV spreadsheet.
 */
export function exportToCsv(receipts: LifeReceipt[]): void {
  const headers = [
    'ID',
    'Category',
    'Timestamp',
    'DisplayDate',
    'Title',
    'Subtitle',
    'Description',
    'Amount',
    'Currency',
    'Location',
    'Mood',
    'Tags',
  ];

  const escapeCsv = (str: string | number | undefined): string => {
    if (str === undefined || str === null) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = receipts.map((r) => [
    escapeCsv(r.id),
    escapeCsv(r.category),
    escapeCsv(r.timestamp),
    escapeCsv(r.displayDate),
    escapeCsv(r.title),
    escapeCsv(r.subtitle),
    escapeCsv(r.description),
    r.amount !== undefined ? r.amount : 0,
    escapeCsv(r.currency || 'INR'),
    escapeCsv(r.location?.name || ''),
    escapeCsv(r.mood),
    escapeCsv(r.tags.join('; ')),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, 'LifeReceipts_Export.csv');
}

/**
 * Exports an authentic 42-column fixed-width ASCII thermal receipt.
 */
export function exportToThermalText(receipts: LifeReceipt[], stats?: LifeStats): void {
  const lineDivider = '==========================================';
  const dashDivider = '------------------------------------------';

  let subtotal = 0;
  receipts.forEach((r) => {
    if (r.amount) subtotal += r.amount;
  });
  const tax = subtotal * 0.18;

  const lines: string[] = [
    lineDivider,
    '          YOUR LIFE, IN RECEIPTS          ',
    '        AUTHENTIC RETROSPECTIVE TAPE      ',
    lineDivider,
    `TERMINAL: RCPT-POS-${Math.floor(1000 + Math.random() * 9000)}`,
    `DATE:     ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}`,
    `DOMAINS:  9 LIFE CATEGORIES`,
    dashDivider,
    'TYPE    MOMENT                      AMOUNT',
    dashDivider,
  ];

  receipts.forEach((r) => {
    const cat = r.category.toUpperCase().slice(0, 6).padEnd(7, ' ');
    const title = r.title.length > 22 ? r.title.slice(0, 21) + '…' : r.title.padEnd(22, ' ');
    const amountStr = r.amount && r.amount > 0 ? `₹${r.amount.toFixed(2)}` : 'FREE';
    const amt = amountStr.padStart(10, ' ');
    lines.push(`${cat} ${title} ${amt}`);
  });

  lines.push(
    dashDivider,
    `MOMENTS COUNT:              ${receipts.length.toString().padStart(10, ' ')} UNITS`,
    `FINANCIAL SUB-TOTAL:        ${`₹${subtotal.toFixed(2)}`.padStart(10, ' ')}`,
    `NOSTALGIA TAX (18%):        ${`₹${tax.toFixed(2)}`.padStart(10, ' ')}`,
    dashDivider,
    'TOTAL EMOTIONAL VALUE:           PRICELESS',
    lineDivider,
    '',
    '             ||| |||| || |||||            ',
    '            |||| || |||| || ||            ',
    '           LR-8942-7710-ARCHIVE           ',
    '',
    '       THANK YOU FOR LIVING THESE MOMENTS ',
    lineDivider
  );

  if (stats) {
    lines.push(
      '',
      `[STATS SUMMARY]`,
      `Most Active Hour: ${stats.mostActiveHour}`,
      `Dominant Emotional Vibe: ${stats.dominantMood.toUpperCase()}`,
      `Connected Memory Threads: ${stats.connectedThreadsCount}`
    );
  }

  const textContent = lines.join('\n');
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
  triggerDownload(blob, 'LifeReceipts_Thermal.txt');
}
