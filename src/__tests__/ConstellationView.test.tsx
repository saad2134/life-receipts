import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConstellationView } from '../components/ConstellationView';
import { LifeReceipt } from '../types/receipt';

const mockReceipts: LifeReceipt[] = [
  {
    id: 'rcpt-1',
    category: 'music',
    timestamp: '2023-11-14T02:00:00.000Z',
    displayDate: '14 Nov 2023, 02:00 AM',
    title: 'Midnight Synth Track',
    subtitle: 'Artist 1',
    description: 'Ambient soundscape.',
    mood: 'melancholic',
    tags: ['music'],
    chapterId: 'ch-1',
    connectedReceiptIds: ['rcpt-2'],
    metadata: { artist: 'Artist 1' },
  },
  {
    id: 'rcpt-2',
    category: 'place',
    timestamp: '2023-11-14T02:30:00.000Z',
    displayDate: '14 Nov 2023, 02:30 AM',
    title: 'Silent Rooftop Observatory',
    subtitle: 'Mumbai',
    description: 'Staring into the night skyline.',
    mood: 'contemplative',
    tags: ['place'],
    chapterId: 'ch-1',
    connectedReceiptIds: ['rcpt-1'],
    location: { name: 'Mumbai Rooftop' },
    metadata: {},
  },
];

describe('ConstellationView Component (FAIE Parameters 5 & 6)', () => {
  it('renders SVG constellation graph and pattern selector chips', () => {
    const onSelect = vi.fn();
    render(
      <ConstellationView
        receipts={mockReceipts}
        onSelectReceipt={onSelect}
        selectedReceipt={null}
      />
    );

    expect(screen.getByRole('img', { name: /Interactive Constellation Graph/i })).toBeInTheDocument();
    expect(screen.getByText(/Discovered Patterns:/i)).toBeInTheDocument();
  });

  it('handles empty receipts array gracefully without NaN errors or crash', () => {
    const onSelect = vi.fn();
    render(
      <ConstellationView
        receipts={[]}
        onSelectReceipt={onSelect}
        selectedReceipt={null}
      />
    );

    expect(screen.getByText('No constellation moments to display.')).toBeInTheDocument();
  });

  it('triggers onSelectReceipt when clicking a node in the graph', () => {
    const onSelect = vi.fn();
    render(
      <ConstellationView
        receipts={mockReceipts}
        onSelectReceipt={onSelect}
        selectedReceipt={null}
      />
    );

    const nodeBtn = screen.getByLabelText(/music: Midnight Synth Track/i);
    fireEvent.click(nodeBtn);
    expect(onSelect).toHaveBeenCalledWith(mockReceipts[0]);
  });

  it('renders reset button when a receipt is selected and resets on click', () => {
    const onSelect = vi.fn();
    render(
      <ConstellationView
        receipts={mockReceipts}
        onSelectReceipt={onSelect}
        selectedReceipt={mockReceipts[0]}
      />
    );

    const resetBtn = screen.getByRole('button', { name: /Reset to Patterns/i });
    expect(resetBtn).toBeInTheDocument();

    fireEvent.click(resetBtn);
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});
