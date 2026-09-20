import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const containerRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: '1', action: 'Switch to Thermal Receipt Tape' },
    { key: '2', action: 'Switch to Bento Grid View' },
    { key: '3', action: 'Switch to Memory Constellation Graph' },
    { key: '4', action: 'Switch to Life Chapters' },
    { key: '/', action: 'Focus Search Bar instantly' },
    { key: 'P', action: 'Print or export physical receipt' },
    { key: 'Esc', action: 'Close active modal or reset selection' },
    { key: '?', action: 'Open / close this shortcuts guide' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        ref={containerRef}
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 id="shortcuts-modal-title" className="text-lg font-bold text-white">
                Keyboard Navigation
              </h2>
              <p className="text-xs text-slate-400">
                FAIE Accessibility: Full hands-on keyboard control
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-800 bg-slate-950/70 rounded-2xl border border-slate-800 p-2">
          {shortcuts.map((item, idx) => (
            <div
              key={idx}
              className="py-2.5 px-3 flex items-center justify-between text-xs"
            >
              <span className="text-slate-300">{item.action}</span>
              <kbd className="px-2 py-1 rounded bg-slate-800 text-amber-300 font-mono font-bold border border-slate-700 shadow-sm text-[11px]">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
          <span className="flex items-center gap-1">
            <Command className="w-3.5 h-3.5 text-amber-400" />
            Full Screen Reader & WCAG AA Ready
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
