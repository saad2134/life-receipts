import { ReceiptCategory, MoodType } from '../types/receipt';

export const APP_CONFIG = {
  APP_NAME: 'LifeReceipts',
  ARCHIVE_EDITION: 'ARCHIVE RETROSPECTIVE EDITION',
  DEFAULT_CURRENCY: 'INR',
  CANONICAL_URL: 'https://your-life-in-receipts.vercel.app/',
};

export interface CategoryMeta {
  label: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  dotColor: string;
  gradient: string;
}

export const CATEGORY_METADATA: Record<ReceiptCategory, CategoryMeta> = {
  music: {
    label: 'Music & Audio',
    badgeBg: 'bg-indigo-500/15',
    badgeBorder: 'border-indigo-500/30',
    badgeText: 'text-indigo-300',
    dotColor: '#6366f1',
    gradient: 'from-indigo-600/20 to-purple-600/20',
  },
  entertainment: {
    label: 'Entertainment',
    badgeBg: 'bg-purple-500/15',
    badgeBorder: 'border-purple-500/30',
    badgeText: 'text-purple-300',
    dotColor: '#a855f7',
    gradient: 'from-purple-600/20 to-pink-600/20',
  },
  place: {
    label: 'Places & Travel',
    badgeBg: 'bg-cyan-500/15',
    badgeBorder: 'border-cyan-500/30',
    badgeText: 'text-cyan-300',
    dotColor: '#06b6d4',
    gradient: 'from-cyan-600/20 to-teal-600/20',
  },
  purchase: {
    label: 'Purchases',
    badgeBg: 'bg-emerald-500/15',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-300',
    dotColor: '#10b981',
    gradient: 'from-emerald-600/20 to-green-600/20',
  },
  photo: {
    label: 'Photos',
    badgeBg: 'bg-amber-500/15',
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-300',
    dotColor: '#f59e0b',
    gradient: 'from-amber-600/20 to-orange-600/20',
  },
  message: {
    label: 'Messages',
    badgeBg: 'bg-sky-500/15',
    badgeBorder: 'border-sky-500/30',
    badgeText: 'text-sky-300',
    dotColor: '#0ea5e9',
    gradient: 'from-sky-600/20 to-blue-600/20',
  },
  search: {
    label: 'Searches',
    badgeBg: 'bg-blue-500/15',
    badgeBorder: 'border-blue-500/30',
    badgeText: 'text-blue-300',
    dotColor: '#3b82f6',
    gradient: 'from-blue-600/20 to-indigo-600/20',
  },
  event: {
    label: 'Events & Plans',
    badgeBg: 'bg-violet-500/15',
    badgeBorder: 'border-violet-500/30',
    badgeText: 'text-violet-300',
    dotColor: '#8b5cf6',
    gradient: 'from-violet-600/20 to-fuchsia-600/20',
  },
  note: {
    label: 'Notes & Reflections',
    badgeBg: 'bg-rose-500/15',
    badgeBorder: 'border-rose-500/30',
    badgeText: 'text-rose-300',
    dotColor: '#f43f5e',
    gradient: 'from-rose-600/20 to-red-600/20',
  },
};

export interface MoodMeta {
  label: string;
  emoji: string;
  color: string;
  bgBadge: string;
  description: string;
}

export const MOOD_METADATA: Record<MoodType, MoodMeta> = {
  euphoric: {
    label: 'Euphoric',
    emoji: '✨',
    color: '#fbbf24',
    bgBadge: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    description: 'Moments of uninhibited celebration, creative peak, or high vitality.',
  },
  melancholic: {
    label: 'Melancholic',
    emoji: '🌙',
    color: '#818cf8',
    bgBadge: 'bg-indigo-400/20 text-indigo-300 border-indigo-400/40',
    description: 'Late-night nostalgia, quiet rain, and beautiful longing.',
  },
  contemplative: {
    label: 'Contemplative',
    emoji: '💭',
    color: '#38bdf8',
    bgBadge: 'bg-sky-400/20 text-sky-300 border-sky-400/40',
    description: 'Reflective self-inquiry, journal writing, and long horizon gazes.',
  },
  energetic: {
    label: 'Energetic',
    emoji: '⚡',
    color: '#f97316',
    bgBadge: 'bg-orange-400/20 text-orange-300 border-orange-400/40',
    description: 'High-speed transit, sprint coding, workouts, and loud bass.',
  },
  anxious: {
    label: 'Anxious',
    emoji: '🌪️',
    color: '#f43f5e',
    bgBadge: 'bg-rose-400/20 text-rose-300 border-rose-400/40',
    description: 'Urgent pivots, financial calculations, and deadlines.',
  },
  peaceful: {
    label: 'Peaceful',
    emoji: '🍃',
    color: '#34d399',
    bgBadge: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40',
    description: 'Morning walks, shared hot tea, and family stability.',
  },
};
