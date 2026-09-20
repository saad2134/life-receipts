import React from 'react';
import { ViewMode } from '../types/receipt';
import {
  Receipt,
  LayoutGrid,
  Network,
  BookOpen,
  Printer,
  Upload,
  Keyboard,
  Sparkles,
  Footprints,
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenUploader: () => void;
  onOpenShortcuts: () => void;
  onPrintReceipt: () => void;
  totalReceipts: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenUploader,
  onOpenShortcuts,
  onPrintReceipt,
  totalReceipts,
}) => {
  const navItems: { id: ViewMode; label: string; icon: React.ComponentType<{ className?: string }>; shortcut: string }[] = [
    { id: 'receipt-tape', label: 'Thermal Tape', icon: Receipt, shortcut: '1' },
    { id: 'bento-grid', label: 'Bento Grid', icon: LayoutGrid, shortcut: '2' },
    { id: 'constellation', label: 'Constellation', icon: Network, shortcut: '3' },
    { id: 'chapters', label: 'Life Chapters', icon: BookOpen, shortcut: '4' },
    { id: 'detective', label: 'Connection Detective', icon: Footprints, shortcut: '5' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 no-print transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
            🧾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white font-mono">
                LifeReceipts
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-2.5 h-2.5" />
                ARCHIVE EDITION
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {totalReceipts} digital moments • Personal Retrospective
            </p>
          </div>
        </div>

        {/* View Switcher Tabs (Desktop & Tablet) */}
        <nav
          aria-label="Main Navigation"
          role="tablist"
          className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${item.id}`}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                <kbd
                  aria-hidden="true"
                  className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                    isActive ? 'bg-amber-600/30 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.shortcut}
                </kbd>
              </button>
            );
          })}
        </nav>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Print / Export Receipt */}
          <button
            onClick={onPrintReceipt}
            aria-label="Print or export thermal receipt"
            title="Print thermal receipt (P)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Print Tape</span>
          </button>

          {/* Dataset Switcher / Uploader */}
          <button
            onClick={onOpenUploader}
            aria-label="Upload custom or organizer dataset"
            title="Load or switch datasets"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700/80 hover:border-blue-500/50 text-slate-200 hover:text-blue-400 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Dataset</span>
          </button>

          {/* Keyboard Shortcuts */}
          <button
            onClick={onOpenShortcuts}
            aria-label="View keyboard shortcuts"
            title="Keyboard Shortcuts (?)"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile View Switcher Tabs (Horizontal scroll bar) */}
      <nav
        role="tablist"
        aria-label="Mobile Navigation"
        className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950 px-2 py-1.5"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              id={`mobile-tab-${item.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${item.id}`}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] gap-0.5 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
