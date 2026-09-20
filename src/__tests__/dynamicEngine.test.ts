import { describe, it, expect } from 'vitest';
import {
  discoverDynamicPatterns,
  synthesizeDynamicChapters,
  filterAndSortReceipts,
} from '../services/correlationEngine';
import { LifeReceipt } from '../types/receipt';

describe('Dynamic Engine & Pattern Synthesis (FAIE Parameters 1, 4 & 6)', () => {
  const mockReceipts: LifeReceipt[] = [
    {
      id: 'rcpt-night-1',
      category: 'music',
      timestamp: '2023-11-14T02:14:00.000Z',
      displayDate: '14 Nov 2023, 02:14 AM',
      title: 'Midnight Resonance',
      subtitle: 'Lana Del Rey',
      description: 'Late night stream.',
      mood: 'melancholic',
      tags: ['music'],
      chapterId: 'ch-1',
      connectedReceiptIds: ['rcpt-night-2'],
      metadata: { artist: 'Lana Del Rey' },
    },
    {
      id: 'rcpt-night-2',
      category: 'note',
      timestamp: '2023-11-14T02:25:00.000Z',
      displayDate: '14 Nov 2023, 02:25 AM',
      title: 'Thoughts on Silence',
      subtitle: 'Personal Note',
      description: 'Reflections in the dark.',
      mood: 'contemplative',
      tags: ['note'],
      chapterId: 'ch-1',
      connectedReceiptIds: ['rcpt-night-1'],
      metadata: {},
    },
    {
      id: 'rcpt-day-1',
      category: 'purchase',
      timestamp: '2023-11-14T10:30:00.000Z',
      displayDate: '14 Nov 2023, 10:30 AM',
      title: 'Coffee Beans',
      subtitle: 'Roastery',
      description: 'Morning beans purchase.',
      amount: 450,
      currency: 'INR',
      mood: 'peaceful',
      tags: ['coffee'],
      chapterId: 'ch-2',
      connectedReceiptIds: [],
      metadata: { merchant: 'Blue Tokai' },
    },
    {
      id: 'rcpt-day-2',
      category: 'purchase',
      timestamp: '2023-11-15T15:00:00.000Z',
      displayDate: '15 Nov 2023, 03:00 PM',
      title: 'Equipment Upgrade',
      subtitle: 'Tech Store',
      description: 'Monitor setup.',
      amount: 14500,
      currency: 'INR',
      mood: 'anxious',
      tags: ['tech'],
      chapterId: 'ch-2',
      connectedReceiptIds: [],
      metadata: { merchant: 'Blue Tokai' }, // Repeating merchant for loop detection
    },
  ];

  it('discovers nocturnal activity spikes in 1 AM - 5 AM window', () => {
    const patterns = discoverDynamicPatterns(mockReceipts);
    const nocturnal = patterns.find((p) => p.category === 'temporal');
    expect(nocturnal).toBeDefined();
    expect(nocturnal?.title).toContain('2:00 AM');
    expect(nocturnal?.connectedReceiptIds).toContain('rcpt-night-1');
    expect(nocturnal?.connectedReceiptIds).toContain('rcpt-night-2');
  });

  it('detects high-frequency loop anchors when an entity repeats', () => {
    const patterns = discoverDynamicPatterns(mockReceipts);
    const loop = patterns.find((p) => p.id === 'dynamic-pattern-loop');
    expect(loop).toBeDefined();
    expect(loop?.title).toContain('Blue Tokai');
    expect(loop?.metrics[0].value).toContain('2 occurrences');
  });

  it('detects financial velocity and computes total tracked capital flow', () => {
    const patterns = discoverDynamicPatterns(mockReceipts);
    const financial = patterns.find((p) => p.category === 'financial');
    expect(financial).toBeDefined();
    expect(financial?.metrics[0].value).toContain('14,950'); // 450 + 14500
  });

  it('gracefully handles empty receipts array without crashing', () => {
    const emptyPatterns = discoverDynamicPatterns([]);
    expect(emptyPatterns.length).toBeGreaterThan(0);

    const emptyChapters = synthesizeDynamicChapters([]);
    expect(emptyChapters.length).toBeGreaterThan(0);
  });

  it('synthesizes dynamic chapters with accurate stats from active receipts', () => {
    const chapters = synthesizeDynamicChapters(mockReceipts);
    expect(chapters.length).toBeGreaterThanOrEqual(1);

    const firstChapter = chapters[0];
    expect(firstChapter.stats.receiptCount).toBeGreaterThan(0);
    expect(firstChapter.narrative).toBeDefined();
    expect(firstChapter.reflection).toBeDefined();
    expect(firstChapter.timeRange).toBeDefined();
  });

  it('filters receipts by minAmount and maxAmount range', () => {
    const filtered = filterAndSortReceipts(mockReceipts, {
      searchQuery: '',
      category: 'all',
      mood: 'all',
      chapterId: 'all',
      sortBy: 'amount-desc',
      minAmount: 1000,
      maxAmount: 20000,
    });

    expect(filtered.length).toBe(1);
    expect(filtered[0].amount).toBe(14500);
  });

  it('filters receipts by startDate and endDate range', () => {
    const filtered = filterAndSortReceipts(mockReceipts, {
      searchQuery: '',
      category: 'all',
      mood: 'all',
      chapterId: 'all',
      sortBy: 'date-asc',
      startDate: '2023-11-15',
      endDate: '2023-11-15',
    });

    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('rcpt-day-2');
  });
});
