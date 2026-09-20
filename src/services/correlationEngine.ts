import { LifeReceipt, MoodType, DetectedPattern, StoryChapter } from '../types/receipt';
import { INITIAL_CHAPTERS, INITIAL_PATTERNS } from '../data/lifeReceiptsData';
import type { FilterOptions } from '../types/filter';

// Re-export FilterOptions for backward compatibility
export type { FilterOptions } from '../types/filter';

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

      // Min amount filter
      if (filters.minAmount !== undefined && !isNaN(filters.minAmount)) {
        if (r.amount === undefined || r.amount < filters.minAmount) {
          return false;
        }
      }

      // Max amount filter
      if (filters.maxAmount !== undefined && !isNaN(filters.maxAmount)) {
        if (r.amount === undefined || r.amount > filters.maxAmount) {
          return false;
        }
      }

      // Start date filter
      if (filters.startDate) {
        const receiptTime = new Date(r.timestamp).getTime();
        const startTime = new Date(filters.startDate).getTime();
        if (!isNaN(startTime) && receiptTime < startTime) {
          return false;
        }
      }

      // End date filter
      if (filters.endDate) {
        const receiptTime = new Date(r.timestamp).getTime();
        const endDateObj = new Date(filters.endDate);
        endDateObj.setHours(23, 59, 59, 999);
        const endTime = endDateObj.getTime();
        if (!isNaN(endTime) && receiptTime > endTime) {
          return false;
        }
      }

      // Search query filter (matches title, subtitle, description, tags, location, artist)
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
 * Accurately calculates subtotal, lifeTax, and items over the entire receipt set.
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
  receipts.forEach((r) => {
    if (typeof r.amount === 'number' && !isNaN(r.amount)) {
      subtotal += r.amount;
    }
  });

  const items = receipts.map((r) => {
    const cost = r.amount !== undefined && r.amount > 0 ? `₹${r.amount.toFixed(2)}` : 'FREE';
    return {
      category: r.category.toUpperCase().slice(0, 6),
      description: r.title.length > 24 ? r.title.slice(0, 22) + '..' : r.title,
      cost,
    };
  });

  const lifeTax = Math.round(subtotal * 0.18 * 100) / 100;

  return {
    merchantName: "LIFE CORP DIGITAL ARCHIVES",
    terminalId: "TERM-2026-ARCHIVE-01",
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

/**
 * Dynamically discovers behavioral, temporal, emotional, and financial patterns
 * from any active list of Life Receipts.
 */
export function discoverDynamicPatterns(receipts: LifeReceipt[]): DetectedPattern[] {
  if (!receipts || receipts.length === 0) {
    return INITIAL_PATTERNS;
  }

  const patterns: DetectedPattern[] = [];

  // 1. Detect Nocturnal / Late-Night Frequencies (1:00 AM - 5:00 AM)
  const lateNightReceipts = receipts.filter((r) => {
    const match = r.timestamp.match(/T(\d{2}):/);
    const hour = match ? parseInt(match[1], 10) : new Date(r.timestamp).getHours();
    return hour >= 1 && hour <= 5;
  });

  if (lateNightReceipts.length > 0) {
    const ratio = Math.round((lateNightReceipts.length / receipts.length) * 100);
    patterns.push({
      id: 'dynamic-pattern-nocturnal',
      title: 'The 2:00 AM Frequencies',
      category: 'temporal',
      description:
        'A concentrated spike of activity during late-night stillness. Introspective music, quiet notes, and nocturnal moments reveal an emotional sanctuary away from daily noise.',
      significance:
        'High correlation between deep night hours and reflective emotional processing.',
      confidenceScore: Math.min(99, Math.max(82, 70 + ratio)),
      connectedReceiptIds: lateNightReceipts.map((r) => r.id).slice(0, 8),
      metrics: [
        { label: 'Nocturnal Moments', value: `${lateNightReceipts.length} entries` },
        { label: 'Night Owl Share', value: `${ratio}% of archive` },
        { label: 'Peak Window', value: '01:00 - 04:30' },
      ],
    });
  }

  // 2. High-Frequency Entity / Routine Loops (Repeating artist or merchant)
  const frequencyMap = new Map<string, { count: number; category: string; ids: string[] }>();
  receipts.forEach((r) => {
    const entity = (r.metadata?.artist as string) || (r.metadata?.merchant as string) || (r.category === 'purchase' ? r.title : null);
    if (entity && entity.length > 2) {
      const existing = frequencyMap.get(entity) || { count: 0, category: r.category, ids: [] };
      existing.count += 1;
      existing.ids.push(r.id);
      frequencyMap.set(entity, existing);
    }
  });

  let topEntity: string | null = null;
  let topCount = 0;
  let topCategory = 'routine';
  let topIds: string[] = [];

  frequencyMap.forEach((val, key) => {
    if (val.count > topCount) {
      topCount = val.count;
      topEntity = key;
      topCategory = val.category;
      topIds = val.ids;
    }
  });

  if (topEntity && topCount >= 2) {
    patterns.push({
      id: 'dynamic-pattern-loop',
      title: `The Anchor Loop: ${topEntity}`,
      category: 'behavioral',
      description: `Repeated engagement with "${topEntity}" reveals a deeply rooted routine and emotional anchor point across your digital days.`,
      significance: `High consistency index across the ${topCategory} spectrum.`,
      confidenceScore: Math.min(97, 85 + topCount * 2),
      connectedReceiptIds: topIds.slice(0, 8),
      metrics: [
        { label: 'Repetitions', value: `${topCount} occurrences` },
        { label: 'Domain', value: topCategory.toUpperCase() },
        { label: 'Habit Strength', value: 'Primary Anchor' },
      ],
    });
  }

  // 3. Cross-Domain Convergence (Different categories within 6-hour windows)
  const sorted = [...receipts].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const convergenceIds = new Set<string>();
  const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

  for (let i = 0; i < sorted.length - 1; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const diff = new Date(sorted[j].timestamp).getTime() - new Date(sorted[i].timestamp).getTime();
      if (diff > SIX_HOURS_MS) break;
      if (sorted[i].category !== sorted[j].category) {
        convergenceIds.add(sorted[i].id);
        convergenceIds.add(sorted[j].id);
      }
    }
  }

  if (convergenceIds.size >= 2) {
    patterns.push({
      id: 'dynamic-pattern-convergence',
      title: 'Cross-Domain Synergy Threads',
      category: 'behavioral',
      description:
        'Distinct life facets—such as soundtrack choices, places visited, and spontaneous purchases—colliding within tight chronological windows to create rich multi-layered memories.',
      significance:
        'Demonstrates holistic harmony where music, commerce, and location reinforce each other.',
      confidenceScore: 94,
      connectedReceiptIds: Array.from(convergenceIds).slice(0, 8),
      metrics: [
        { label: 'Synchronized Moments', value: `${convergenceIds.size} receipts` },
        { label: 'Window Span', value: '≤ 6 Hours' },
        { label: 'Synergy Level', value: 'High Correlation' },
      ],
    });
  }

  // 4. Financial Velocity Pattern
  let totalFinancialSpend = 0;
  let paidCount = 0;
  receipts.forEach((r) => {
    if (r.amount && r.amount > 0) {
      totalFinancialSpend += r.amount;
      paidCount++;
    }
  });

  if (paidCount > 0) {
    const avgOutlay = totalFinancialSpend / paidCount;
    patterns.push({
      id: 'dynamic-pattern-financial',
      title: 'Resource Allocation Velocity',
      category: 'financial',
      description: `Analysis of ₹${Math.round(totalFinancialSpend).toLocaleString('en-IN')} in digital transactions shows purposeful resource flow concentrated around daily experiences and deliberate investments.`,
      significance: 'Reveals the real cost of memories and everyday convenience.',
      confidenceScore: 89,
      connectedReceiptIds: receipts.filter((r) => r.amount && r.amount > 0).map((r) => r.id).slice(0, 8),
      metrics: [
        { label: 'Total Tracked Flow', value: `₹${Math.round(totalFinancialSpend).toLocaleString('en-IN')}` },
        { label: 'Average Transaction', value: `₹${Math.round(avgOutlay).toLocaleString('en-IN')}` },
        { label: 'Paid Events', value: `${paidCount} moments` },
      ],
    });
  }

  // 5. Emotional Center of Gravity
  const moodCounts: Record<MoodType, number> = {
    contemplative: 0,
    euphoric: 0,
    melancholic: 0,
    energetic: 0,
    anxious: 0,
    peaceful: 0,
  };
  receipts.forEach((r) => {
    if (r.mood && moodCounts[r.mood] !== undefined) {
      moodCounts[r.mood] += 1;
    }
  });

  let dominantMood: MoodType = 'contemplative';
  let maxMoodCount = 0;
  (Object.keys(moodCounts) as MoodType[]).forEach((m) => {
    if (moodCounts[m] > maxMoodCount) {
      maxMoodCount = moodCounts[m];
      dominantMood = m;
    }
  });

  const moodDominanceRatio = Math.round((maxMoodCount / (receipts.length || 1)) * 100);
  patterns.push({
    id: 'dynamic-pattern-emotional',
    title: `The ${dominantMood.charAt(0).toUpperCase() + dominantMood.slice(1)} Resonance`,
    category: 'emotional',
    description: `Your emotional baseline gravitates towards a ${dominantMood} state, accounting for ${moodDominanceRatio}% of tracked emotional markers.`,
    significance: `Identifies the psychological anchor stabilizing this retrospective chapter.`,
    confidenceScore: 93,
    connectedReceiptIds: receipts.filter((r) => r.mood === dominantMood).map((r) => r.id).slice(0, 8),
    metrics: [
      { label: 'Dominant Mood', value: dominantMood.toUpperCase() },
      { label: 'Resonance Index', value: `${moodDominanceRatio}%` },
      { label: 'Stability Rank', value: 'Primary State' },
    ],
  });

  return patterns;
}

const CHAPTER_GRADIENTS = [
  {
    themeColor: '#6366f1',
    bgGradient: 'from-indigo-950 via-slate-900 to-slate-950',
    accentColor: '#818cf8',
  },
  {
    themeColor: '#0ea5e9',
    bgGradient: 'from-cyan-950 via-slate-900 to-slate-950',
    accentColor: '#38bdf8',
  },
  {
    themeColor: '#f59e0b',
    bgGradient: 'from-amber-950 via-slate-900 to-slate-950',
    accentColor: '#fbbf24',
  },
  {
    themeColor: '#10b981',
    bgGradient: 'from-emerald-950 via-slate-900 to-slate-950',
    accentColor: '#34d399',
  },
  {
    themeColor: '#ec4899',
    bgGradient: 'from-rose-950 via-slate-900 to-slate-950',
    accentColor: '#f472b6',
  },
];

/**
 * Automatically groups receipts chronologically and synthesizes rich, evocative
 * story chapters complete with narrative prose, reflections, and dynamic metrics.
 */
export function synthesizeDynamicChapters(receipts: LifeReceipt[]): StoryChapter[] {
  if (!receipts || receipts.length === 0) {
    return INITIAL_CHAPTERS;
  }

  // Sort receipts chronologically
  const sorted = [...receipts].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Divide into 3 to 5 logical chronological epochs
  const chapterCount = Math.min(5, Math.max(2, Math.ceil(sorted.length / 7)));
  const chunkSize = Math.ceil(sorted.length / chapterCount);
  const chapters: StoryChapter[] = [];

  for (let i = 0; i < chapterCount; i++) {
    const chunk = sorted.slice(i * chunkSize, (i + 1) * chunkSize);
    if (chunk.length === 0) continue;

    const firstDate = new Date(chunk[0].timestamp);
    const lastDate = new Date(chunk[chunk.length - 1].timestamp);

    const timeRange = `${firstDate.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    })} – ${lastDate.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    })}`;

    let totalSpend = 0;
    const moodTally: Record<MoodType, number> = {
      contemplative: 0,
      euphoric: 0,
      melancholic: 0,
      energetic: 0,
      anxious: 0,
      peaceful: 0,
    };
    let topTrack = 'Midnight Ambient Synthesis';
    let topPlace = 'The Urban Horizon';

    chunk.forEach((r) => {
      if (r.amount) totalSpend += r.amount;
      if (r.mood && moodTally[r.mood] !== undefined) {
        moodTally[r.mood]++;
      }
      if (r.category === 'music' && topTrack === 'Midnight Ambient Synthesis') {
        topTrack = r.metadata?.artist ? `${r.title} by ${r.metadata.artist}` : r.title;
      }
      if (r.location?.name && topPlace === 'The Urban Horizon') {
        topPlace = r.location.name;
      }
    });

    let dominantMood: MoodType = 'contemplative';
    let maxMood = 0;
    (Object.keys(moodTally) as MoodType[]).forEach((m) => {
      if (moodTally[m] > maxMood) {
        maxMood = moodTally[m];
        dominantMood = m;
      }
    });

    const style = CHAPTER_GRADIENTS[i % CHAPTER_GRADIENTS.length];
    const chapterNumber = i + 1;

    // Craft contextual chapter title & narrative
    const titlesByChapter = [
      'The Dawn Frequencies',
      'The Momentum of Motion',
      'The Anchors & Hearth',
      'The Ambition Sprint',
      'The Quiet Renaissance',
    ];
    const chapterTitle = titlesByChapter[i] || `Chapter ${chapterNumber}: The Unfolding`;

    const taglinesByMood: Record<MoodType, string> = {
      contemplative: 'Late-night solitude, quiet queries, and the search for subtle meaning.',
      euphoric: 'Breakthrough milestones, shared music, and boundless creative energy.',
      melancholic: 'Rain-soaked windows, reflective soundtracks, and tender memories.',
      energetic: 'High-velocity pursuits, swift transactions, and focused drive.',
      anxious: 'Overcoming turbulence through deliberate choices and persistent courage.',
      peaceful: 'Gentle mornings, slow tea, and contentment in ordinary wonders.',
    };

    const narrative = `During this epoch spanning ${timeRange}, your digital footprints formed a tapestry of ${chunk.length} documented moments. Grounded in a ${dominantMood} state of mind, each receipt tells an authentic slice of lived truth: from soundscapes like ${topTrack} playing through everyday routines, to physical crossings around ${topPlace}. With a total outlay of ₹${Math.round(totalSpend).toLocaleString('en-IN')}, every transaction and note served as an indelible marker of human presence and personal growth.`;

    const reflection = `Every line item is a fragment of who we were; together, they reveal how we arrived at who we are today.`;

    chapters.push({
      id: `ch-${chapterNumber}`,
      number: chapterNumber,
      title: chapterTitle,
      tagline: taglinesByMood[dominantMood] || 'Everyday moments coalescing into lasting memory.',
      timeRange,
      narrative,
      reflection,
      themeColor: style.themeColor,
      bgGradient: style.bgGradient,
      accentColor: style.accentColor,
      receiptIds: chunk.map((r) => r.id),
      stats: {
        receiptCount: chunk.length,
        totalSpend,
        topTrack,
        topPlace,
        dominantMood,
      },
    });
  }

  return chapters;
}
