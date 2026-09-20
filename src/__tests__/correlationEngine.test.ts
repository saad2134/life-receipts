import { describe, it, expect } from 'vitest';
import {
  filterAndSortReceipts,
  findConnectedReceipts,
  discoverStoryThreads,
  compileReceiptTape,
} from '../services/correlationEngine';
import { INITIAL_LIFE_RECEIPTS } from '../data/lifeReceiptsData';

describe('Correlation Engine & Pattern Discovery (FAIE Parameters 1, 4 & 6)', () => {
  it('filters receipts by category accurately', () => {
    const musicOnly = filterAndSortReceipts(INITIAL_LIFE_RECEIPTS, {
      searchQuery: '',
      category: 'music',
      mood: 'all',
      chapterId: 'all',
      sortBy: 'date-desc',
    });

    expect(musicOnly.length).toBeGreaterThan(0);
    musicOnly.forEach((r) => {
      expect(r.category).toBe('music');
    });
  });

  it('filters receipts by search query across titles, tags, and artists', () => {
    const results = filterAndSortReceipts(INITIAL_LIFE_RECEIPTS, {
      searchQuery: 'Lana Del Rey',
      category: 'all',
      mood: 'all',
      chapterId: 'all',
      sortBy: 'date-desc',
    });

    expect(results.length).toBeGreaterThan(0);
    const hasMatch = results.some(
      (r) =>
        r.title.includes('Born To Die') ||
        (r.metadata?.artist && String(r.metadata.artist).includes('Lana Del Rey'))
    );
    expect(hasMatch).toBe(true);
  });

  it('finds connected cross-domain receipts for a given anchor receipt', () => {
    const anchor = INITIAL_LIFE_RECEIPTS.find((r) => r.id === 'rcpt-001')!;
    expect(anchor).toBeDefined();

    const connected = findConnectedReceipts(anchor, INITIAL_LIFE_RECEIPTS);
    expect(connected.length).toBeGreaterThan(0);
    // Should include search and note from the 2 AM moment
    const connectedIds = connected.map((r) => r.id);
    expect(connectedIds).toContain('rcpt-002');
  });

  it('discovers multi-category narrative threads across digital moments', () => {
    const threads = discoverStoryThreads(INITIAL_LIFE_RECEIPTS);
    expect(threads.length).toBeGreaterThan(0);
    expect(threads[0].receipts.length).toBeGreaterThanOrEqual(2);
  });

  it('compiles thermal receipt tape breakdown with tax and totals', () => {
    const tape = compileReceiptTape(INITIAL_LIFE_RECEIPTS);
    expect(tape.terminalId).toContain('TERM-2026-ARCHIVE');
    expect(tape.items.length).toBeGreaterThan(0);
    expect(tape.totalUnits).toBe(INITIAL_LIFE_RECEIPTS.length);
    expect(tape.barcodeValue).toBeDefined();
  });
});
