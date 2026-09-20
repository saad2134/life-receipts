// Generated Life Receipts Dataset
// Source: Modularized from chapters.ts, patterns.ts, and initialReceipts.ts
import { LifeReceipt, LifeStats, MoodType } from '../types/receipt';
import { INITIAL_PATTERNS } from './patterns';

export { INITIAL_CHAPTERS } from './chapters';
export { INITIAL_PATTERNS } from './patterns';
export { INITIAL_LIFE_RECEIPTS } from './initialReceipts';

export function calculateLifeStats(receipts: LifeReceipt[]): LifeStats {
  const categoryCounts = {
    music: 0,
    entertainment: 0,
    place: 0,
    purchase: 0,
    photo: 0,
    message: 0,
    search: 0,
    event: 0,
    note: 0,
  };

  let totalSpend = 0;
  const hourFrequency: Record<number, number> = {};
  const moodFrequency: Record<string, number> = {};
  const uniquePlaces = new Set<string>();

  receipts.forEach((r) => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    if (r.amount) totalSpend += r.amount;

    // Mood tracking
    moodFrequency[r.mood] = (moodFrequency[r.mood] || 0) + 1;

    // Place tracking
    if (r.location?.name) {
      uniquePlaces.add(r.location.name);
    }

    // Hour tracking
    try {
      const d = new Date(r.timestamp);
      const hr = d.getHours();
      hourFrequency[hr] = (hourFrequency[hr] || 0) + 1;
    } catch {}
  });

  // Find most active hour
  let maxHr = 2;
  let maxHrCount = 0;
  Object.entries(hourFrequency).forEach(([hrStr, count]) => {
    if (count > maxHrCount) {
      maxHrCount = count;
      maxHr = parseInt(hrStr, 10);
    }
  });

  const formattedHr = `${maxHr.toString().padStart(2, '0')}:00`;

  // Find dominant mood
  let domMood: MoodType = 'contemplative';
  let maxMoodCount = 0;
  Object.entries(moodFrequency).forEach(([mood, count]) => {
    if (count > maxMoodCount) {
      maxMoodCount = count;
      domMood = mood as MoodType;
    }
  });

  return {
    totalReceipts: receipts.length,
    categoryCounts,
    totalSpend,
    currency: "INR",
    mostActiveHour: formattedHr,
    dominantMood: domMood,
    connectedThreadsCount: INITIAL_PATTERNS.length,
    placesTraversed: uniquePlaces.size,
    soundtrackTracksCount: categoryCounts.music,
  };
}
