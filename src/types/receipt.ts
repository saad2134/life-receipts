export type ReceiptCategory =
  | 'music'
  | 'entertainment'
  | 'place'
  | 'purchase'
  | 'photo'
  | 'message'
  | 'search'
  | 'event'
  | 'note';

export type MoodType =
  | 'euphoric'
  | 'melancholic'
  | 'contemplative'
  | 'energetic'
  | 'anxious'
  | 'peaceful';

export interface LocationInfo {
  name: string;
  city?: string;
  state?: string;
  lat?: number;
  long?: number;
}

export interface LifeReceipt {
  id: string;
  category: ReceiptCategory;
  timestamp: string; // ISO 8601 string: e.g. "2023-11-14T02:14:00"
  displayDate: string; // e.g. "14 Nov 2023, 02:14 AM"
  title: string;
  subtitle: string;
  description: string;
  amount?: number;
  currency?: string;
  location?: LocationInfo;
  mood: MoodType;
  tags: string[];
  chapterId: string;
  connectedReceiptIds: string[];
  rawSource?: 'spotify' | 'household_trans' | 'india_trans' | 'synthetic';
  metadata: {
    // Category-specific details
    artist?: string;
    album?: string;
    trackDurationMs?: number;
    platform?: string;
    merchant?: string;
    serviceProvider?: string;
    paymentMode?: string;
    cameraDevice?: string;
    searchQuery?: string;
    searchEngine?: string;
    messagePartner?: string;
    eventVenue?: string;
    noteType?: string;
    [key: string]: unknown;
  };
}

export interface StoryChapter {
  id: string;
  number: number;
  title: string;
  tagline: string;
  timeRange: string;
  narrative: string;
  reflection: string;
  themeColor: string;
  bgGradient: string;
  accentColor: string;
  receiptIds: string[];
  stats: {
    receiptCount: number;
    totalSpend: number;
    topTrack: string;
    topPlace: string;
    dominantMood: MoodType;
  };
}

export interface DetectedPattern {
  id: string;
  title: string;
  category: 'temporal' | 'emotional' | 'behavioral' | 'financial';
  description: string;
  significance: string;
  confidenceScore: number; // e.g., 94 for 94%
  connectedReceiptIds: string[];
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface LifeStats {
  totalReceipts: number;
  categoryCounts: Record<ReceiptCategory, number>;
  totalSpend: number;
  currency: string;
  mostActiveHour: string;
  dominantMood: MoodType;
  connectedThreadsCount: number;
  placesTraversed: number;
  soundtrackTracksCount: number;
}

export type ViewMode = 'receipt-tape' | 'bento-grid' | 'constellation' | 'chapters';
