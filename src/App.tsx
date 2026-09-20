/**
 * App.tsx — Root application shell.
 *
 * This component is a thin presentation shell that consumes all state
 * and actions from the centralized ReceiptContext via the useReceipts() hook.
 * It contains zero local state — all state management is delegated to
 * the ReceiptProvider mounted in main.tsx.
 */
import { lazy, Suspense } from 'react';
import { useReceipts } from './context/ReceiptContext';
import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { FilterBar } from './components/FilterBar';
import { ReceiptCard } from './components/ReceiptCard';
import { ReceiptDetailModal } from './components/ReceiptDetailModal';
import { DatasetUploaderModal } from './components/DatasetUploaderModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sparkles, Heart } from 'lucide-react';

/** Code-split secondary views for runtime efficiency & bundle optimization */
const ReceiptTapeView = lazy(() =>
  import('./components/ReceiptTapeView').then((m) => ({ default: m.ReceiptTapeView }))
);
const ConstellationView = lazy(() =>
  import('./components/ConstellationView').then((m) => ({ default: m.ConstellationView }))
);
const ChapterStoryView = lazy(() =>
  import('./components/ChapterStoryView').then((m) => ({ default: m.ChapterStoryView }))
);
const ConnectionDetectiveView = lazy(() =>
  import('./components/ConnectionDetectiveView').then((m) => ({ default: m.ConnectionDetectiveView }))
);

/** Suspense fallback skeleton shown while lazy views are loading */
function ViewLoadingSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4 text-center animate-pulse"
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-400">
        <Sparkles className="w-6 h-6 animate-spin" />
      </div>
      <p className="text-sm font-semibold text-slate-300">
        Illuminating digital retrospective view...
      </p>
      <span className="sr-only">Loading view content</span>
    </div>
  );
}

/**
 * Root application component.
 * Consumes all state from ReceiptContext — contains zero local state.
 */
export function App() {
  const {
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
  } = useReceipts();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-body selection:bg-amber-400/30 selection:text-amber-200">
        {/* Navigation Bar */}
        <Navbar
          currentView={currentView}
          onViewChange={setCurrentView}
          onOpenUploader={openUploader}
          onOpenShortcuts={openShortcuts}
          onPrintReceipt={() => window.print()}
          totalReceipts={receipts.length}
        />

        {/* Global Summary Statistics Banner */}
        <StatsBanner
          stats={stats}
          onOpenConstellation={() => setCurrentView('constellation')}
        />

        {/* Search & Category Filter Controls (Shown in Grid & Tape views) */}
        {(currentView === 'bento-grid' || currentView === 'receipt-tape') && (
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            categoryCounts={stats.categoryCounts}
            totalResults={filteredReceipts.length}
          />
        )}

        {/* Main Content Area with Semantic Landmark */}
        <main id="main-content" className="flex-1 pb-16">
          <Suspense fallback={<ViewLoadingSkeleton />}>
            {/* VIEW 1: Authentic Thermal Receipt Tape */}
            {currentView === 'receipt-tape' && (
              <section
                id="panel-receipt-tape"
                role="tabpanel"
                aria-labelledby="tab-receipt-tape"
                tabIndex={0}
              >
                <ReceiptTapeView
                  receipts={filteredReceipts}
                  onSelectReceipt={setSelectedReceipt}
                />
              </section>
            )}

            {/* VIEW 2: Bento Grid Cards Explorer */}
            {currentView === 'bento-grid' && (
              <section
                id="panel-bento-grid"
                role="tabpanel"
                aria-labelledby="tab-bento-grid"
                tabIndex={0}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
              >
                {filteredReceipts.length === 0 ? (
                  <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
                    <p className="text-base font-bold text-slate-300">
                      No life receipts matched your current filters.
                    </p>
                    <p className="text-xs text-slate-400">
                      Try searching for another artist, location, or reset the filters.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredReceipts.map((receipt) => (
                      <ReceiptCard
                        key={receipt.id}
                        receipt={receipt}
                        onSelectReceipt={setSelectedReceipt}
                        onTraceThread={traceThread}
                        onFilterByTag={filterByTag}
                        isHighlighted={highlightedThreadReceiptIds.has(receipt.id)}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* VIEW 3: Memory Constellation Relationship Graph */}
            {currentView === 'constellation' && (
              <section
                id="panel-constellation"
                role="tabpanel"
                aria-labelledby="tab-constellation"
                tabIndex={0}
              >
                <ConstellationView
                  receipts={receipts}
                  onSelectReceipt={setSelectedReceipt}
                  selectedReceipt={selectedReceipt}
                />
              </section>
            )}

            {/* VIEW 4: Interactive Life Chapters Storytelling */}
            {currentView === 'chapters' && (
              <section
                id="panel-chapters"
                role="tabpanel"
                aria-labelledby="tab-chapters"
                tabIndex={0}
              >
                <ChapterStoryView
                  receipts={receipts}
                  onSelectReceipt={setSelectedReceipt}
                />
              </section>
            )}

            {/* VIEW 5: Connection Detective Mode (Multi-Receipt Chain Investigation) */}
            {currentView === 'detective' && (
              <section
                id="panel-detective"
                role="tabpanel"
                aria-labelledby="tab-detective"
                tabIndex={0}
              >
                <ConnectionDetectiveView
                  receipts={receipts}
                  onSelectReceipt={setSelectedReceipt}
                />
              </section>
            )}
          </Suspense>
        </main>

        {/* Modal: Receipt Deep-Dive Inspection */}
        <ReceiptDetailModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          allReceipts={receipts}
          onSelectReceipt={setSelectedReceipt}
        />

        {/* Modal: Dataset Switcher / Uploader */}
        <DatasetUploaderModal
          isOpen={isUploaderOpen}
          onClose={closeUploader}
          onDatasetLoad={(loaded) => {
            setReceipts(loaded);
            closeUploader();
          }}
          onResetDefault={resetDefaultDataset}
          currentCount={receipts.length}
        />

        {/* Modal: Accessibility & Keyboard Shortcuts Guide */}
        <KeyboardShortcutsModal
          isOpen={isShortcutsOpen}
          onClose={closeShortcuts}
        />

        {/* Accessible Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-400 space-y-2 no-print">
          <div className="flex items-center justify-center gap-2">
            <span className="font-bold text-slate-300 font-mono">Your Life, In Receipts</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Digital Memory Architecture
            </span>
          </div>
          <p className="flex items-center justify-center gap-1 text-[11px]">
            Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> as a Digital Life Retrospective
          </p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
