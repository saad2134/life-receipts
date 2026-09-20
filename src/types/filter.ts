/**
 * Centralized filter type definitions for the LifeReceipts application.
 * Extracted from correlationEngine to maintain single-responsibility architecture.
 */
import type { ReceiptCategory, MoodType } from './receipt';

/**
 * Multi-facet filter options for querying and sorting life receipts.
 */
export interface FilterOptions {
  /** Full-text search query across title, subtitle, description, tags, location, artist */
  searchQuery: string;
  /** Filter by receipt category (or 'all' for no category filter) */
  category: ReceiptCategory | 'all';
  /** Filter by emotional mood tag (or 'all' for no mood filter) */
  mood: MoodType | 'all';
  /** Filter by life chapter ID (or 'all' for no chapter filter) */
  chapterId: string | 'all';
  /** Sort order for results */
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'connections-desc';
  /** Minimum transaction amount filter */
  minAmount?: number;
  /** Maximum transaction amount filter */
  maxAmount?: number;
  /** Start date filter (ISO 8601 string) */
  startDate?: string;
  /** End date filter (ISO 8601 string) */
  endDate?: string;
}

/** Default filter state with no active filters applied */
export const DEFAULT_FILTERS: FilterOptions = {
  searchQuery: '',
  category: 'all',
  mood: 'all',
  chapterId: 'all',
  sortBy: 'date-desc',
  minAmount: undefined,
  maxAmount: undefined,
  startDate: undefined,
  endDate: undefined,
};
