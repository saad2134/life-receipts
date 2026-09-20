import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { LifeReceipt, ViewMode, LifeStats } from '../types/receipt';
import { FilterOptions } from '../types/filter';
import { INITIAL_LIFE_RECEIPTS, calculateLifeStats } from '../data/lifeReceiptsData';
import { filterAndSortReceipts } from '../services/correlationEngine';
import { exportToJson, exportToCsv, exportToThermalText } from '../services/exportService';

export interface ReceiptContextType {
  receipts: LifeReceipt[];
  filteredReceipts: LifeReceipt[];
  stats: LifeStats;
  currentView: ViewMode;
  selectedReceipt: LifeReceipt | null;
  highlightedThreadReceiptIds: Set<string>;
  filters: FilterOptions;
  isUploaderOpen: boolean;
  isShortcutsOpen: boolean;
  // Actions
  setCurrentView: (view: ViewMode) => void;
  setSelectedReceipt: (receipt: LifeReceipt | null) => void;
  setReceipts: (receipts: LifeReceipt[]) => void;
  setFilters: (update: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  filterByTag: (tag: string) => void;
  traceThread: (targetReceipt: LifeReceipt) => void;
  openUploader: () => void;
  closeUploader: () => void;
  openShortcuts: () => void;
  closeShortcuts: () => void;
  resetDefaultDataset: () => void;
  exportData: (format: 'json' | 'csv' | 'thermal') => void;
}

const DEFAULT_FILTERS: FilterOptions = {
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

const ReceiptContext = createContext<ReceiptContextType | undefined>(undefined);

export const ReceiptProvider: React.FC<{
  children: ReactNode;
  initialReceipts?: LifeReceipt[];
  initialView?: ViewMode;
}> = ({ children, initialReceipts = INITIAL_LIFE_RECEIPTS, initialView = 'receipt-tape' }) => {
  const [currentView, setCurrentView] = useState<ViewMode>(initialView);
  const [receipts, setReceipts] = useState<LifeReceipt[]>(initialReceipts);
  const [selectedReceipt, setSelectedReceipt] = useState<LifeReceipt | null>(null);
  const [highlightedThreadReceiptIds, setHighlightedThreadReceiptIds] = useState<Set<string>>(
    new Set()
  );

  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Multi-facet filter state
  const [filters, setFiltersState] = useState<FilterOptions>(DEFAULT_FILTERS);

  // Derived life stats
  const stats = useMemo(() => calculateLifeStats(receipts), [receipts]);

  // Filtered and sorted receipts for explorer views
  const filteredReceipts = useMemo(() => {
    return filterAndSortReceipts(receipts, filters);
  }, [receipts, filters]);

  const setFilters = useCallback((update: Partial<FilterOptions>) => {
    setFiltersState((prev: FilterOptions) => ({ ...prev, ...update }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const filterByTag = useCallback((tag: string) => {
    setFiltersState((prev: FilterOptions) => ({
      ...prev,
      searchQuery: tag,
    }));
    setCurrentView('bento-grid');
  }, []);

  const traceThread = useCallback((targetReceipt: LifeReceipt) => {
    const threadSet = new Set([targetReceipt.id, ...(targetReceipt.connectedReceiptIds || [])]);
    setHighlightedThreadReceiptIds(threadSet);
    setSelectedReceipt(targetReceipt);
  }, []);

  const openUploader = useCallback(() => setIsUploaderOpen(true), []);
  const closeUploader = useCallback(() => setIsUploaderOpen(false), []);

  const openShortcuts = useCallback(() => setIsShortcutsOpen(true), []);
  const closeShortcuts = useCallback(() => setIsShortcutsOpen(false), []);

  const resetDefaultDataset = useCallback(() => {
    setReceipts(INITIAL_LIFE_RECEIPTS);
    setIsUploaderOpen(false);
  }, []);

  const exportData = useCallback(
    (format: 'json' | 'csv' | 'thermal') => {
      if (format === 'json') {
        exportToJson(receipts);
      } else if (format === 'csv') {
        exportToCsv(receipts);
      } else if (format === 'thermal') {
        exportToThermalText(receipts, stats);
      }
    },
    [receipts, stats]
  );

  // Global Keyboard Navigation (1, 2, 3, 4, 5, p, ?)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside text inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === '1') setCurrentView('receipt-tape');
      if (e.key === '2') setCurrentView('bento-grid');
      if (e.key === '3') setCurrentView('constellation');
      if (e.key === '4') setCurrentView('chapters');
      if (e.key === '5') setCurrentView('detective');
      if (e.key.toLowerCase() === 'p') window.print();
      if (e.key === '?') setIsShortcutsOpen((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const value = useMemo<ReceiptContextType>(
    () => ({
      receipts,
      filteredReceipts,
      stats,
      currentView,
      selectedReceipt,
      highlightedThreadReceiptIds,
      filters,
      isUploaderOpen,
      isShortcutsOpen,
      setCurrentView,
      setSelectedReceipt,
      setReceipts,
      setFilters,
      resetFilters,
      filterByTag,
      traceThread,
      openUploader,
      closeUploader,
      openShortcuts,
      closeShortcuts,
      resetDefaultDataset,
      exportData,
    }),
    [
      receipts,
      filteredReceipts,
      stats,
      currentView,
      selectedReceipt,
      highlightedThreadReceiptIds,
      filters,
      isUploaderOpen,
      isShortcutsOpen,
      setCurrentView,
      setSelectedReceipt,
      setReceipts,
      setFilters,
      resetFilters,
      filterByTag,
      traceThread,
      openUploader,
      closeUploader,
      openShortcuts,
      closeShortcuts,
      resetDefaultDataset,
      exportData,
    ]
  );

  return <ReceiptContext.Provider value={value}>{children}</ReceiptContext.Provider>;
};

export function useReceipts(): ReceiptContextType {
  const context = useContext(ReceiptContext);
  if (!context) {
    throw new Error('useReceipts must be used within a ReceiptProvider');
  }
  return context;
}
