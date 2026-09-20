import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChapterStoryView } from '../components/ChapterStoryView';
import { LifeReceipt } from '../types/receipt';

const mockReceipts: LifeReceipt[] = [
  {
    id: 'rcpt-1',
    category: 'music',
    timestamp: '2023-11-14T02:14:00.000Z',
    displayDate: '14 Nov 2023, 02:14 AM',
    title: 'Born To Die',
    subtitle: 'Lana Del Rey',
    description: 'A quiet midnight frequency.',
    mood: 'melancholic',
    tags: ['music'],
    chapterId: 'ch-1',
    connectedReceiptIds: [],
    metadata: { artist: 'Lana Del Rey' },
  },
  {
    id: 'rcpt-2',
    category: 'purchase',
    timestamp: '2023-11-15T12:00:00.000Z',
    displayDate: '15 Nov 2023, 12:00 PM',
    title: 'Artisan Notebook',
    subtitle: 'Stationery',
    description: 'Purchased notebook.',
    amount: 350,
    currency: 'INR',
    mood: 'peaceful',
    tags: ['purchase'],
    chapterId: 'ch-1',
    connectedReceiptIds: [],
    metadata: {},
  },
  {
    id: 'rcpt-3',
    category: 'event',
    timestamp: '2023-12-01T18:00:00.000Z',
    displayDate: '01 Dec 2023, 06:00 PM',
    title: 'Winter Festival',
    subtitle: 'Square',
    description: 'Festive gathering.',
    mood: 'euphoric',
    tags: ['event'],
    chapterId: 'ch-2',
    connectedReceiptIds: [],
    metadata: {},
  },
];

describe('ChapterStoryView Component (FAIE Parameters 4 & 6)', () => {
  it('renders synthesized chapter title, narrative, and reflection quote', () => {
    const onSelect = vi.fn();
    render(<ChapterStoryView receipts={mockReceipts} onSelectReceipt={onSelect} />);

    expect(screen.getByText(/CHAPTER 1/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Born To Die/i).length).toBeGreaterThan(0);
  });

  it('switches chapters when clicking chapter navigation tab', () => {
    const onSelect = vi.fn();
    render(<ChapterStoryView receipts={mockReceipts} onSelectReceipt={onSelect} />);

    const ch2Btn = screen.getByRole('button', { name: /Ch 2/i });
    expect(ch2Btn).toBeInTheDocument();

    fireEvent.click(ch2Btn);
    expect(screen.getByText(/CHAPTER 2/i)).toBeInTheDocument();
  });

  it('navigates with next and previous buttons', () => {
    const onSelect = vi.fn();
    render(<ChapterStoryView receipts={mockReceipts} onSelectReceipt={onSelect} />);

    const nextBtn = screen.getByRole('button', { name: /Next Chapter/i });
    fireEvent.click(nextBtn);
    expect(screen.getByText(/CHAPTER 2/i)).toBeInTheDocument();

    const prevBtn = screen.getByRole('button', { name: /Previous Chapter/i });
    fireEvent.click(prevBtn);
    expect(screen.getByText(/CHAPTER 1/i)).toBeInTheDocument();
  });

  it('triggers speech narration when clicking Play Narration button', () => {
    const speakSpy = vi.spyOn(window.speechSynthesis, 'speak');
    const onSelect = vi.fn();
    render(<ChapterStoryView receipts={mockReceipts} onSelectReceipt={onSelect} />);

    const playBtn = screen.getByRole('button', { name: /Play spoken narration/i });
    fireEvent.click(playBtn);
    expect(speakSpy).toHaveBeenCalled();

    speakSpy.mockRestore();
  });

  it('triggers onSelectReceipt when clicking a receipt card within the chapter', () => {
    const onSelect = vi.fn();
    render(<ChapterStoryView receipts={mockReceipts} onSelectReceipt={onSelect} />);

    const receiptCardTitle = screen.getByText('Artisan Notebook');
    fireEvent.click(receiptCardTitle);
    expect(onSelect).toHaveBeenCalledWith(mockReceipts[1]);
  });
});
