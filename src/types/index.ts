/**
 * Barrel export for all type definitions in the LifeReceipts application.
 * Import from '@/types' for clean, centralized type access.
 */

// Core domain types
export type {
  ReceiptCategory,
  MoodType,
  LocationInfo,
  LifeReceipt,
  StoryChapter,
  DetectedPattern,
  LifeStats,
  ViewMode,
} from './receipt';

// Filter types
export type { FilterOptions } from './filter';
export { DEFAULT_FILTERS } from './filter';
