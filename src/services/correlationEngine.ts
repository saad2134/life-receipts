import { LifeReceipt, ReceiptCategory, MoodType } from '../types/receipt';

export interface FilterOptions {
  searchQuery: string;
  category: ReceiptCategory | 'all';
  mood: MoodType | 'all';
  chapterId: string | 'all';
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'connections-desc';
}

/**
 * Filter and sort life receipts based on multi-faceted criteria.
 */
export function filterAndSortReceipts(
  receipts: LifeReceipt[],
  filters: FilterOptions
): LifeReceipt[] {
  const query = filters.searchQuery.trim().toLowerCase();

  return receipts
    .filter((r) => {
      // Category filter
      if (filters.category !== 'all' && r.category !== filters.category) {
        return false;
      }

      // Mood filter
      if (filters.mood !== 'all' && r.mood !== filters.mood) {
        return false;
      }

      // Chapter filter
      if (filters.chapterId !== 'all' && r.chapterId !== filters.chapterId) {
        return false;
      }

      // Search query filter (matches title, subtitle, description, tags, location)
      if (query) {
        const titleMatch = r.title.toLowerCase().includes(query);
        const subtitleMatch = r.subtitle.toLowerCase().includes(query);
        const descMatch = r.description.toLowerCase().includes(query);
        const tagMatch = r.tags.some((t) => t.toLowerCase().includes(query));
        const locationMatch = r.location?.name.toLowerCase().includes(query);
        const artistMatch = r.metadata?.artist
          ? String(r.metadata.artist).toLowerCase().includes(query)
          : false;

        if (!titleMatch && !subtitleMatch && !descMatch && !tagMatch && !locationMatch && !artistMatch) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'date-desc') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      if (filters.sortBy === 'date-asc') {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      if (filters.sortBy === 'amount-desc') {
        return (b.amount || 0) - (a.amount || 0);
      }
      if (filters.sortBy === 'connections-desc') {
        return (b.connectedReceiptIds?.length || 0) - (a.connectedReceiptIds?.length || 0);
      }
      return 0;
    });
}

/**
 * Finds all receipts related to a target receipt either via direct connection
 * or temporal proximity (within 60 minutes).
 */
export function findConnectedReceipts(
  targetReceipt: LifeReceipt,
  allReceipts: LifeReceipt[]
): LifeReceipt[] {
  const directConnectedIds = new Set(targetReceipt.connectedReceiptIds || []);
  const targetTime = new Date(targetReceipt.timestamp).getTime();
  const ONE_HOUR_MS = 60 * 60 * 1000;

  return allReceipts.filter((r) => {
    if (r.id === targetReceipt.id) return false;

    // Direct link
    if (directConnectedIds.has(r.id)) return true;
    if (r.connectedReceiptIds?.includes(targetReceipt.id)) return true;

    // Temporal proximity link (within 60 mins)
    const diff = Math.abs(new Date(r.timestamp).getTime() - targetTime);
    if (diff <= ONE_HOUR_MS) return true;

    // Same location on same day
    if (
      targetReceipt.location?.name &&
      r.location?.name === targetReceipt.location.name &&
      diff <= 24 * ONE_HOUR_MS
    ) {
      return true;
    }

    return false;
  });
}

/**
 * Discovers narrative story threads that connect across multiple categories.
 */
export function discoverStoryThreads(receipts: LifeReceipt[]): {
  threadId: string;
  theme: string;
  receipts: LifeReceipt[];
}[] {
  const threads: { threadId: string; theme: string; receipts: LifeReceipt[] }[] = [];
  const processed = new Set<string>();

  receipts.forEach((r) => {
    if (processed.has(r.id) || !r.connectedReceiptIds || r.connectedReceiptIds.length === 0) {
      return;
    }

    const connected = [r];
    processed.add(r.id);

    r.connectedReceiptIds.forEach((connId) => {
      const found = receipts.find((item) => item.id === connId);
      if (found && !processed.has(found.id)) {
        connected.push(found);
        processed.add(found.id);
      }
    });

    if (connected.length >= 2) {
      threads.push({
        threadId: `thread-${r.id}`,
        theme: r.title,
        receipts: connected.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ),
      });
    }
  });

  return threads;
}

/**
 * Computes an authentic thermal receipt breakdown for printing or export.
 */
export interface ReceiptTapeBreakdown {
  merchantName: string;
  terminalId: string;
  dateStr: string;
  items: {
    category: string;
    description: string;
    cost: string;
  }[];
  subtotal: number;
  lifeTax: number;
  emotionalValue: string;
  totalUnits: number;
  barcodeValue: string;
}

export function compileReceiptTape(receipts: LifeReceipt[]): ReceiptTapeBreakdown {
  let subtotal = 0;
  const items = receipts.slice(0, 15).map((r) => {
    const cost = r.amount ? `₹${r.amount.toFixed(2)}` : 'FREE';
    if (r.amount) subtotal += r.amount;
    return {
      category: r.category.toUpperCase().slice(0, 6),
      description: r.title.length > 24 ? r.title.slice(0, 22) + '..' : r.title,
      cost,
    };
  });

  const lifeTax = Math.round(subtotal * 0.18);

  return {
    merchantName: "LIFE CORP DIGITAL ARCHIVES",
    terminalId: "TERM-2026-WEBRUSH-FAIE",
    dateStr: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    items,
    subtotal,
    lifeTax,
    emotionalValue: "PRICELESS",
    totalUnits: receipts.length,
    barcodeValue: `*LIFERCPT-${receipts.length}-NOSTALGIA*`,
  };
}
