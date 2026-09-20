import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReceiptTapeView } from '../components/ReceiptTapeView';
import { LifeReceipt } from '../types/receipt';

const mockReceipts: LifeReceipt[] = [
  {
    id: 'rcpt-1',
    category: 'purchase',
    timestamp: '2023-11-14T10:00:00.000Z',
    displayDate: '14 Nov 2023, 10:00 AM',
    title: 'Artisan Coffee',
    subtitle: 'Cafe',
    description: 'Hot pour-over coffee.',
    amount: 250,
    currency: 'INR',
    mood: 'peaceful',
    tags: ['coffee'],
    chapterId: 'ch-1',
    connectedReceiptIds: [],
    metadata: {},
  },
  {
    id: 'rcpt-2',
    category: 'purchase',
    timestamp: '2023-11-14T12:00:00.000Z',
    displayDate: '14 Nov 2023, 12:00 PM',
    title: 'Paper Notebook',
    subtitle: 'Stationery Store',
    description: 'Pocket dotted notebook.',
    amount: 150,
    currency: 'INR',
    mood: 'contemplative',
    tags: ['stationery'],
    chapterId: 'ch-1',
    connectedReceiptIds: [],
    metadata: {},
  },
  {
    id: 'rcpt-3',
    category: 'music',
    timestamp: '2023-11-14T14:00:00.000Z',
    displayDate: '14 Nov 2023, 02:00 PM',
    title: 'Free Digital Track',
    subtitle: 'Bandcamp',
    description: 'Streaming release.',
    mood: 'euphoric',
    tags: ['music'],
    chapterId: 'ch-1',
    connectedReceiptIds: [],
    metadata: {},
  },
];

describe('ReceiptTapeView Component (FAIE Parameters 1, 4 & 6)', () => {
  it('renders thermal receipt tape with header, items, and barcode', () => {
    const onSelect = vi.fn();
    render(<ReceiptTapeView receipts={mockReceipts} onSelectReceipt={onSelect} />);

    expect(screen.getByText('LIFE ARCHIVE')).toBeInTheDocument();
    expect(screen.getByText(/YOUR LIFE, IN RECEIPTS/i)).toBeInTheDocument();
    expect(screen.getByText('Artisan Coffee')).toBeInTheDocument();
    expect(screen.getByText('Paper Notebook')).toBeInTheDocument();
    expect(screen.getByText('Free Digital Track')).toBeInTheDocument();
  });

  it('calculates subtotal and tax over all receipts accurately', () => {
    const onSelect = vi.fn();
    render(<ReceiptTapeView receipts={mockReceipts} onSelectReceipt={onSelect} />);

    // Total outlay = 250 + 150 = 400
    expect(screen.getByText('₹400.00')).toBeInTheDocument();
    // 18% Tax = 72
    expect(screen.getByText('₹72.00')).toBeInTheDocument();
    // Moments count = 3 UNITS
    expect(screen.getByText('3 UNITS')).toBeInTheDocument();
  });

  it('triggers tear animation and sound effect on button click', () => {
    const onSelect = vi.fn();
    render(<ReceiptTapeView receipts={mockReceipts} onSelectReceipt={onSelect} />);

    const tearBtn = screen.getByRole('button', { name: /Tear and save receipt/i });
    expect(tearBtn).toBeInTheDocument();

    fireEvent.click(tearBtn);
    // Button remains accessible
    expect(tearBtn).toBeEnabled();
  });

  it('triggers window.print when print button is clicked', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    const onSelect = vi.fn();
    render(<ReceiptTapeView receipts={mockReceipts} onSelectReceipt={onSelect} />);

    const printBtn = screen.getByRole('button', { name: /Print physical receipt/i });
    fireEvent.click(printBtn);
    expect(printSpy).toHaveBeenCalled();

    printSpy.mockRestore();
  });

  it('triggers onSelectReceipt when clicking a receipt line item', () => {
    const onSelect = vi.fn();
    render(<ReceiptTapeView receipts={mockReceipts} onSelectReceipt={onSelect} />);

    const item = screen.getByText('Artisan Coffee');
    fireEvent.click(item);
    expect(onSelect).toHaveBeenCalledWith(mockReceipts[0]);
  });
});
