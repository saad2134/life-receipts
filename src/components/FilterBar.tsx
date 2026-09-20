import React, { useState, useEffect } from 'react';
import { ReceiptCategory, MoodType } from '../types/receipt';
import { FilterOptions } from '../types/filter';
import { useDebounce } from '../hooks/useDebounce';
import {
  Search,
  X,
  Music,
  Tv,
  MapPin,
  ShoppingBag,
  Camera,
  MessageSquare,
  SearchCode,
  Calendar,
  FileText,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
  categoryCounts: Record<ReceiptCategory, number>;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  categoryCounts,
  totalResults,
}) => {
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [localSearch, setLocalSearch] = useState(filters.searchQuery);
  const debouncedSearch = useDebounce(localSearch, 200);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sync debounced search to filter state
  useEffect(() => {
    if (debouncedSearch !== filters.searchQuery) {
      onFilterChange({ searchQuery: debouncedSearch });
    }
  }, [debouncedSearch, filters.searchQuery, onFilterChange]);

  // Sync back if parent resets filters
  useEffect(() => {
    setLocalSearch(filters.searchQuery);
  }, [filters.searchQuery]);

  // Global hotkey '/' to jump to search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories: {
    id: ReceiptCategory | 'all';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }[] = [
    { id: 'all', label: 'All Receipts', icon: SlidersHorizontal },
    { id: 'music', label: 'Music', icon: Music, count: categoryCounts.music },
    { id: 'entertainment', label: 'Movies & Media', icon: Tv, count: categoryCounts.entertainment },
    { id: 'place', label: 'Places', icon: MapPin, count: categoryCounts.place },
    { id: 'purchase', label: 'Purchases', icon: ShoppingBag, count: categoryCounts.purchase },
    { id: 'photo', label: 'Photos', icon: Camera, count: categoryCounts.photo },
    { id: 'message', label: 'Messages', icon: MessageSquare, count: categoryCounts.message },
    { id: 'search', label: 'Searches', icon: SearchCode, count: categoryCounts.search },
    { id: 'event', label: 'Events', icon: Calendar, count: categoryCounts.event },
    { id: 'note', label: 'Personal Notes', icon: FileText, count: categoryCounts.note },
  ];

  const hasActiveFilters = Boolean(
    filters.searchQuery ||
      filters.category !== 'all' ||
      filters.mood !== 'all' ||
      filters.chapterId !== 'all' ||
      filters.minAmount !== undefined ||
      filters.maxAmount !== undefined ||
      filters.startDate ||
      filters.endDate
  );

  const handleResetAll = () => {
    setLocalSearch('');
    onFilterChange({
      searchQuery: '',
      category: 'all',
      mood: 'all',
      chapterId: 'all',
      minAmount: undefined,
      maxAmount: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <section
      aria-label="Receipt Search and Filters"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 no-print space-y-3"
    >
      {/* Top row: Search input + Mood / Chapter / Sort controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search input with hotkey */}
        <div className="relative w-full md:w-96">
          <label htmlFor="receipt-search-input" className="sr-only">
            Search life receipts
          </label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="receipt-search-input"
            ref={searchInputRef}
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search tracks, notes, places, tags... (Press '/' to focus)"
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/80 transition-all font-sans"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch('');
                onFilterChange({ searchQuery: '' });
              }}
              aria-label="Clear search input"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Secondary controls: Mood, Chapter, Sort dropdowns & Advanced Filters toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Mood Filter */}
          <div className="shrink-0">
            <label htmlFor="mood-filter-select" className="sr-only">
              Filter by Mood
            </label>
            <select
              id="mood-filter-select"
              value={filters.mood}
              onChange={(e) => onFilterChange({ mood: e.target.value as MoodType | 'all' })}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 transition-all font-sans cursor-pointer"
            >
              <option value="all">All Moods</option>
              <option value="melancholic">🌙 Melancholic</option>
              <option value="contemplative">💭 Contemplative</option>
              <option value="peaceful">🍃 Peaceful</option>
              <option value="energetic">⚡ Energetic</option>
              <option value="euphoric">✨ Euphoric</option>
              <option value="anxious">⚠️ Anxious</option>
            </select>
          </div>

          {/* Chapter Filter */}
          <div className="shrink-0">
            <label htmlFor="chapter-filter-select" className="sr-only">
              Filter by Life Chapter
            </label>
            <select
              id="chapter-filter-select"
              value={filters.chapterId}
              onChange={(e) => onFilterChange({ chapterId: e.target.value })}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 transition-all font-sans cursor-pointer"
            >
              <option value="all">All Chapters</option>
              <option value="ch-1">Ch 1</option>
              <option value="ch-2">Ch 2</option>
              <option value="ch-3">Ch 3</option>
              <option value="ch-4">Ch 4</option>
              <option value="ch-5">Ch 5</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="shrink-0">
            <label htmlFor="sort-filter-select" className="sr-only">
              Sort Receipts
            </label>
            <select
              id="sort-filter-select"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterOptions['sortBy'] })}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 transition-all font-sans cursor-pointer"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="connections-desc">Most Connected</option>
            </select>
          </div>

          {/* Toggle Advanced Filters (Amount & Date Range) */}
          <button
            onClick={() => setShowAdvancedFilters((prev) => !prev)}
            aria-expanded={showAdvancedFilters}
            aria-controls="advanced-filters-panel"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Toggle Amount and Date Range Filters"
          >
            <span>Range</span>
            {showAdvancedFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel (Amount & Date Ranges) */}
      {showAdvancedFilters && (
        <div id="advanced-filters-panel" className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in duration-150 text-xs">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Min Amount (₹)
            </label>
            <input
              type="number"
              placeholder="0"
              value={filters.minAmount !== undefined ? filters.minAmount : ''}
              onChange={(e) =>
                onFilterChange({
                  minAmount: e.target.value !== '' ? parseFloat(e.target.value) : undefined,
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Max Amount (₹)
            </label>
            <input
              type="number"
              placeholder="10000"
              value={filters.maxAmount !== undefined ? filters.maxAmount : ''}
              onChange={(e) =>
                onFilterChange({
                  maxAmount: e.target.value !== '' ? parseFloat(e.target.value) : undefined,
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) =>
                onFilterChange({
                  startDate: e.target.value || undefined,
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) =>
                onFilterChange({
                  endDate: e.target.value || undefined,
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
        </div>
      )}

      {/* Category Pills horizontal scroller */}
      <div
        role="region"
        aria-label="Category Filters"
        className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1"
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ category: cat.id })}
              aria-pressed={isSelected}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              {typeof cat.count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Result feedback bar with aria-live="polite" */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span aria-live="polite" aria-atomic="true">
          Showing <strong className="text-white">{totalResults}</strong> moments found
        </span>
        {hasActiveFilters && (
          <button
            onClick={handleResetAll}
            className="text-amber-400 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>
    </section>
  );
};
