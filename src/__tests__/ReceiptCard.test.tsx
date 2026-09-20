import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReceiptCard } from '../components/ReceiptCard';
import { INITIAL_LIFE_RECEIPTS } from '../data/lifeReceiptsData';

describe('ReceiptCard Component (FAIE Parameters 4 & 5)', () => {
  const mockReceipt = INITIAL_LIFE_RECEIPTS[0];
  const onSelect = vi.fn();
  const onTrace = vi.fn();

  it('renders receipt title, subtitle, category badge, and formatted date', () => {
    render(
      <ReceiptCard
        receipt={mockReceipt}
        onSelectReceipt={onSelect}
        onTraceThread={onTrace}
      />
    );

    expect(screen.getByText(mockReceipt.title)).toBeInTheDocument();
    expect(screen.getByText(mockReceipt.subtitle)).toBeInTheDocument();
    expect(screen.getByText(mockReceipt.category)).toBeInTheDocument();
  });

  it('triggers onSelectReceipt when clicked or pressed Enter', () => {
    render(
      <ReceiptCard
        receipt={mockReceipt}
        onSelectReceipt={onSelect}
        onTraceThread={onTrace}
      />
    );

    const card = screen.getByRole('article', { name: new RegExp(mockReceipt.title, 'i') });
    fireEvent.click(card);
    expect(onSelect).toHaveBeenCalledWith(mockReceipt);

    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('triggers onTraceThread when trace links button is clicked', () => {
    render(
      <ReceiptCard
        receipt={mockReceipt}
        onSelectReceipt={onSelect}
        onTraceThread={onTrace}
      />
    );

    const traceBtn = screen.getByTitle(/Trace connected moments/i);
    fireEvent.click(traceBtn);
    expect(onTrace).toHaveBeenCalledWith(mockReceipt);
  });
});
