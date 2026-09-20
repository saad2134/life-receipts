import { LifeReceipt, ReceiptCategory, MoodType } from '../types/receipt';
import { sanitizeText, hasPrototypePollution } from './security';

/**
 * Universal Dataset Parser Service
 * Automatically detects and ingests:
 * 1. Spotify Streaming History (CSV)
 * 2. Daily Household Transactions (CSV)
 * 3. India Transact Multi-Facet Transactions (JSON / CSV)
 * 4. Native LifeReceipts JSON format
 */

/**
 * Helper to parse a CSV string taking into account quoted fields containing commas.
 */
export function parseCSVLines(csvText: string): string[][] {
  const lines: string[][] = [];
  const rawLines = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    const row: string[] = [];
    let insideQuotes = false;
    let currentToken = '';

    for (let i = 0; i < rawLine.length; i++) {
      const char = rawLine[i];
      if (char === '"') {
        if (insideQuotes && rawLine[i + 1] === '"') {
          // Escaped quote
          currentToken += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        row.push(currentToken.trim());
        currentToken = '';
      } else {
        currentToken += char;
      }
    }
    row.push(currentToken.trim());
    lines.push(row);
  }

  return lines;
}

/**
 * Derives emotional mood based on timestamp hour
 */
function deriveMoodFromHour(hour: number): MoodType {
  if (hour >= 1 && hour <= 5) return 'melancholic';
  if (hour >= 6 && hour <= 11) return 'peaceful';
  if (hour >= 12 && hour <= 16) return 'energetic';
  if (hour >= 17 && hour <= 21) return 'euphoric';
  return 'contemplative';
}

/**
 * Formats a Date object into human-readable display date
 */
function formatDisplayDate(date: Date): string {
  if (isNaN(date.getTime())) return 'Archive Date';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Automatically infers relational and temporal graph connections for uploaded datasets.
 * Connects moments occurring within 90-120 minutes of each other or sharing high affinity
 * (such as matching artist, merchant, place, or consecutive listening sessions).
 */
export function autoLinkTemporalReceipts(receipts: LifeReceipt[]): LifeReceipt[] {
  if (!receipts || receipts.length <= 1) return receipts;

  const TWO_HOURS_MS = 120 * 60 * 1000;
  const MAX_CONNECTIONS_PER_NODE = 4;

  const connectedMap = new Map<string, Set<string>>();
  receipts.forEach((r) => {
    connectedMap.set(r.id, new Set(r.connectedReceiptIds || []));
  });

  const sorted = [...receipts].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const currentSet = connectedMap.get(current.id)!;
    const currentTime = new Date(current.timestamp).getTime();

    for (let j = i + 1; j < sorted.length; j++) {
      if (currentSet.size >= MAX_CONNECTIONS_PER_NODE) break;

      const neighbor = sorted[j];
      const neighborSet = connectedMap.get(neighbor.id)!;
      if (neighborSet.size >= MAX_CONNECTIONS_PER_NODE) continue;

      const neighborTime = new Date(neighbor.timestamp).getTime();
      const timeDiff = Math.abs(neighborTime - currentTime);

      let shouldConnect = false;

      // 1. Temporal Proximity Link: Within 90-120 minutes
      if (!isNaN(currentTime) && !isNaN(neighborTime) && timeDiff <= TWO_HOURS_MS) {
        shouldConnect = true;
      }

      // 2. High Semantic Affinity: Matching artist, merchant, or location
      const currentArtist = current.metadata?.artist;
      const neighborArtist = neighbor.metadata?.artist;
      if (currentArtist && neighborArtist && String(currentArtist).toLowerCase() === String(neighborArtist).toLowerCase()) {
        shouldConnect = true;
      }

      const currentMerchant = current.metadata?.merchant;
      const neighborMerchant = neighbor.metadata?.merchant;
      if (currentMerchant && neighborMerchant && String(currentMerchant).toLowerCase() === String(neighborMerchant).toLowerCase()) {
        shouldConnect = true;
      }

      const currentLocation = current.location?.name;
      const neighborLocation = neighbor.location?.name;
      if (currentLocation && neighborLocation && currentLocation === neighborLocation) {
        shouldConnect = true;
      }

      if (shouldConnect) {
        currentSet.add(neighbor.id);
        neighborSet.add(current.id);
      }
    }
  }

  return receipts.map((r) => {
    const connSet = connectedMap.get(r.id);
    return {
      ...r,
      connectedReceiptIds: connSet ? Array.from(connSet) : [],
    };
  });
}

/**
 * Parses Spotify streaming history CSV
 */
export function parseSpotifyCSV(csvContent: string): LifeReceipt[] {
  const rows = parseCSVLines(csvContent);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.toLowerCase().trim());
  const trackIdx = headers.findIndex((h) => h.includes('track_name') || h === 'track');
  const artistIdx = headers.findIndex((h) => h.includes('artist_name') || h === 'artist');
  const albumIdx = headers.findIndex((h) => h.includes('album_name') || h === 'album');
  const tsIdx = headers.findIndex((h) => h === 'ts' || h.includes('time') || h.includes('date'));
  const msIdx = headers.findIndex((h) => h.includes('ms_played') || h.includes('ms'));
  const platformIdx = headers.findIndex((h) => h.includes('platform'));

  const receipts: LifeReceipt[] = [];
  const maxRows = Math.min(rows.length, 500); // Process up to 500 for optimal memory & responsiveness

  for (let i = 1; i < maxRows; i++) {
    const row = rows[i];
    const track = row[trackIdx] || 'Unknown Track';
    const artist = row[artistIdx] || 'Various Artists';
    const album = albumIdx >= 0 ? row[albumIdx] : 'Single / EP';
    const platform = platformIdx >= 0 ? row[platformIdx] : 'Spotify';
    const msPlayed = msIdx >= 0 ? parseInt(row[msIdx], 10) || 180000 : 180000;

    let timestamp = new Date().toISOString();
    let displayDate = 'Recent Stream';
    let hour = 14;

    if (tsIdx >= 0 && row[tsIdx]) {
      const parsedDate = new Date(row[tsIdx]);
      if (!isNaN(parsedDate.getTime())) {
        timestamp = parsedDate.toISOString();
        displayDate = formatDisplayDate(parsedDate);
        hour = parsedDate.getHours();
      }
    }

    const mood = deriveMoodFromHour(hour);
    const seconds = Math.round(msPlayed / 1000);

    receipts.push({
      id: `spotify-rcpt-${i}`,
      category: 'music',
      timestamp,
      displayDate,
      title: sanitizeText(track),
      subtitle: sanitizeText(artist),
      description: sanitizeText(`Streamed via ${platform} (${album}) for ${seconds}s.`),
      mood,
      tags: ['spotify', 'music', artist.toLowerCase(), platform.toLowerCase()].filter(Boolean),
      chapterId: 'ch-1',
      connectedReceiptIds: [],
      rawSource: 'spotify',
      metadata: {
        artist,
        album,
        platform,
        trackDurationMs: msPlayed,
      },
    });
  }

  return autoLinkTemporalReceipts(receipts);
}

/**
 * Parses Daily Household Transactions CSV
 */
export function parseHouseholdCSV(csvContent: string): LifeReceipt[] {
  const rows = parseCSVLines(csvContent);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.toLowerCase().trim());
  const dateIdx = headers.findIndex((h) => h.includes('date'));
  const modeIdx = headers.findIndex((h) => h.includes('mode'));
  const catIdx = headers.findIndex((h) => h === 'category');
  const subcatIdx = headers.findIndex((h) => h.includes('subcat'));
  const noteIdx = headers.findIndex((h) => h.includes('note'));
  const amtIdx = headers.findIndex((h) => h.includes('amount') || h.includes('amt'));

  const receipts: LifeReceipt[] = [];
  const maxRows = Math.min(rows.length, 500);

  for (let i = 1; i < maxRows; i++) {
    const row = rows[i];
    const rawDate = dateIdx >= 0 ? row[dateIdx] : '';
    const mode = modeIdx >= 0 ? row[modeIdx] : 'Cash';
    const categoryName = catIdx >= 0 ? row[catIdx] : 'General';
    const subcat = subcatIdx >= 0 ? row[subcatIdx] : '';
    const note = noteIdx >= 0 ? row[noteIdx] : '';
    const rawAmt = amtIdx >= 0 ? parseFloat(row[amtIdx]) : 0;
    const amount = isNaN(rawAmt) ? 0 : rawAmt;

    // Parse DD/MM/YYYY HH:mm:ss or DD/MM/YYYY
    let parsedDate = new Date();
    if (rawDate) {
      const parts = rawDate.split(/[\s/:]+/);
      if (parts.length >= 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const hr = parts[3] ? parseInt(parts[3], 10) : 12;
        const min = parts[4] ? parseInt(parts[4], 10) : 0;
        const sec = parts[5] ? parseInt(parts[5], 10) : 0;
        parsedDate = new Date(year, month, day, hr, min, sec);
      }
    }

    const timestamp = isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
    const displayDate = formatDisplayDate(parsedDate);

    // Map category
    let category: ReceiptCategory = 'purchase';
    if (categoryName.toLowerCase().includes('festiv') || subcat.toLowerCase().includes('puja')) {
      category = 'event';
    } else if (categoryName.toLowerCase().includes('transport') || subcat.toLowerCase().includes('travel')) {
      category = 'place';
    }

    const title = note || subcat || categoryName;
    const subtitle = `${mode} • ${categoryName}${subcat ? ` - ${subcat}` : ''}`;
    const description = note ? `Paid ₹${amount} for ${note} via ${mode}.` : `Household expense in ${categoryName} via ${mode}.`;

    const mood: MoodType =
      category === 'event'
        ? 'euphoric'
        : categoryName.toLowerCase().includes('food')
        ? 'peaceful'
        : amount > 2500
        ? 'contemplative'
        : 'peaceful';

    receipts.push({
      id: `household-rcpt-${i}`,
      category,
      timestamp,
      displayDate,
      title: sanitizeText(title),
      subtitle: sanitizeText(subtitle),
      description: sanitizeText(description),
      amount,
      currency: 'INR',
      mood,
      tags: ['household', categoryName.toLowerCase(), mode.toLowerCase()].filter(Boolean),
      chapterId: 'ch-2',
      connectedReceiptIds: [],
      rawSource: 'household_trans',
      metadata: {
        paymentMode: mode,
        merchant: subcat || categoryName,
        category: categoryName,
      },
    });
  }

  return autoLinkTemporalReceipts(receipts);
}

/**
 * Parses India Transact Multi-Facet JSON dataset
 */
export function parseIndiaTransactJSON(data: unknown[]): LifeReceipt[] {
  const receipts: LifeReceipt[] = [];
  const maxRows = Math.min(data.length, 500);

  for (let i = 0; i < maxRows; i++) {
    const item = data[i] as Record<string, unknown>;
    if (!item) continue;

    const transId = item.trans_id ? String(item.trans_id) : `${i + 1}`;
    const rawMerchant = (item.merchant as string) || '';
    const cleanMerchant = rawMerchant.replace(/^fraud_/i, '').trim() || 'Retail Merchant';
    const rawCategory = (item.category as string) || 'online_shopping';
    const amt = typeof item.amt === 'number' ? item.amt : parseFloat(String(item.amt || 0)) || 0;
    const city = (item.city as string) || '';
    const state = (item.state as string) || '';
    const rawTime = (item.trans_date_trans_time as string) || '';

    let parsedDate = new Date();
    if (rawTime) {
      const parts = rawTime.split(/[\s/:]+/);
      if (parts.length >= 3) {
        // MM/DD/YYYY H:mm
        const month = parseInt(parts[0], 10) - 1;
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        const hr = parts[3] ? parseInt(parts[3], 10) : 12;
        const min = parts[4] ? parseInt(parts[4], 10) : 0;
        parsedDate = new Date(year, month, day, hr, min);
      }
    }

    const timestamp = isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
    const displayDate = formatDisplayDate(parsedDate);

    let category: ReceiptCategory = 'purchase';
    if (rawCategory.includes('entertainment')) {
      category = 'entertainment';
    } else if (rawCategory.includes('travel')) {
      category = 'place';
    }

    const locationName = city ? `${city}, ${state || 'India'}` : state || 'Digital Merchant';
    const mood: MoodType = amt > 7000 ? 'anxious' : amt > 3000 ? 'contemplative' : 'peaceful';

    receipts.push({
      id: `india-rcpt-${transId}`,
      category,
      timestamp,
      displayDate,
      title: sanitizeText(cleanMerchant),
      subtitle: sanitizeText(`${locationName} • ₹${amt.toFixed(2)}`),
      description: sanitizeText(`Digital payment of ₹${amt.toFixed(2)} at ${cleanMerchant} (${rawCategory.replace(/_/g, ' ')}).`),
      amount: amt,
      currency: 'INR',
      location: {
        name: locationName,
        city: city || undefined,
        state: state || undefined,
      },
      mood,
      tags: ['transact', rawCategory.toLowerCase(), city.toLowerCase()].filter(Boolean),
      chapterId: 'ch-3',
      connectedReceiptIds: [],
      rawSource: 'india_trans',
      metadata: {
        merchant: cleanMerchant,
        category: rawCategory,
      },
    });
  }

  return autoLinkTemporalReceipts(receipts);
}

/**
 * Universal auto-detection entry point.
 * Ingests file content and file name, automatically detects file type,
 * validates against prototype pollution, and parses into LifeReceipt[].
 */
export function parseUploadedDataset(fileContent: string, fileName: string): LifeReceipt[] {
  if (!fileContent || !fileContent.trim()) {
    throw new Error('Dataset file is empty.');
  }

  const cleanContent = fileContent.trim();
  const lowerName = fileName.toLowerCase();

  // Try JSON first if content starts with '[' or '{' or file ends in .json
  if (cleanContent.startsWith('[') || cleanContent.startsWith('{') || lowerName.endsWith('.json')) {
    if (/"(__proto__|constructor|prototype)"\s*:/i.test(cleanContent)) {
      throw new Error('Security Error: Dataset contains forbidden prototype pollution properties.');
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleanContent);
    } catch {
      throw new Error('Invalid JSON format. Please ensure valid JSON syntax.');
    }

    if (hasPrototypePollution(parsed)) {
      throw new Error('Security Error: Dataset contains forbidden prototype pollution properties.');
    }

    if (!Array.isArray(parsed)) {
      throw new Error('Dataset JSON must contain an array of records.');
    }

    if (parsed.length === 0) {
      throw new Error('Dataset array is empty.');
    }

    const sample = parsed[0] as Record<string, unknown>;

    // Case A: Native LifeReceipts JSON
    if ('id' in sample && 'category' in sample && 'title' in sample && 'timestamp' in sample) {
      const nativeList = parsed as LifeReceipt[];
      const hasLinks = nativeList.some((r) => r.connectedReceiptIds && r.connectedReceiptIds.length > 0);
      return hasLinks ? nativeList : autoLinkTemporalReceipts(nativeList);
    }

    // Case B: India Transact JSON
    if ('trans_date_trans_time' in sample || 'merchant' in sample || 'cc_num' in sample || 'amt' in sample) {
      return parseIndiaTransactJSON(parsed);
    }

    throw new Error('Unrecognized JSON structure. Expected LifeReceipt[] or India Transact schema.');
  }

  // Handle CSV / TSV
  const firstLine = cleanContent.split('\n')[0].toLowerCase();

  // Case C: Spotify History CSV
  if (
    firstLine.includes('spotify_track_uri') ||
    (firstLine.includes('track_name') && firstLine.includes('artist_name'))
  ) {
    const parsed = parseSpotifyCSV(cleanContent);
    if (parsed.length === 0) {
      throw new Error('Failed to parse Spotify streaming rows.');
    }
    return parsed;
  }

  // Case D: Daily Household Transactions CSV
  if (
    firstLine.includes('income/expense') ||
    (firstLine.includes('mode') && firstLine.includes('subcategory')) ||
    firstLine.includes('currency')
  ) {
    const parsed = parseHouseholdCSV(cleanContent);
    if (parsed.length === 0) {
      throw new Error('Failed to parse Household Transaction rows.');
    }
    return parsed;
  }

  // Fallback: If it has comma-separated fields with amount or title
  if (firstLine.includes(',')) {
    // Attempt household parse as standard transaction CSV
    const parsed = parseHouseholdCSV(cleanContent);
    if (parsed.length > 0) return parsed;
  }

  throw new Error(
    `Unsupported file format for "${fileName}". Supported: Spotify streaming history CSV, Household Transactions CSV, India Transact JSON, and LifeReceipts JSON.`
  );
}

/**
 * Pre-loaded Representative Datasets for instant 1-click testing & evaluator validation.
 */
export const PRELOADED_DATASET_OPTIONS = [
  {
    id: 'default-harmonized',
    name: 'Harmonized Digital Life (All 9 Domains)',
    description: 'Official 30 curated receipts covering all 9 digital life domains with rich connections.',
    type: 'native' as const,
  },
  {
    id: 'spotify-history',
    name: 'Spotify Streaming History (Organizer Dataset)',
    description: 'Streams parsed from spotify_history.csv with late-night moods and platform details.',
    type: 'spotify' as const,
  },
  {
    id: 'household-transactions',
    name: 'Daily Household Transactions (Organizer Dataset)',
    description: 'Financial outlays parsed from Daily Household Transactions.csv.',
    type: 'household' as const,
  },
  {
    id: 'india-transact',
    name: 'India Multi-Facet Transact (Organizer Dataset)',
    description: 'Consumer commerce records parsed from Augmented_IndiaTransactMultiFacet2024.json.',
    type: 'india' as const,
  },
];
