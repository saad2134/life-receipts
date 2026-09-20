import React from 'react';
import { LifeReceipt } from '../types/receipt';
import {
  X,
  Clock,
  MapPin,
  Tag,
  Network,
  Database,
  ArrowRight,
} from 'lucide-react';
import { sanitizeText } from '../services/security';

import { useFocusTrap } from '../hooks/useFocusTrap';

interface ReceiptDetailModalProps {
  receipt: LifeReceipt | null;
  onClose: () => void;
  allReceipts: LifeReceipt[];
  onSelectReceipt: (receipt: LifeReceipt) => void;
}

export const ReceiptDetailModal: React.FC<ReceiptDetailModalProps> = ({
  receipt,
  onClose,
  allReceipts,
  onSelectReceipt,
}) => {
  const containerRef = useFocusTrap<HTMLDivElement>(Boolean(receipt), onClose);

  if (!receipt) return null;

  // Find all directly connected receipts
  const connectedMoments = allReceipts.filter((r) =>
    receipt.connectedReceiptIds?.includes(r.id)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-receipt-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Content */}
      <div
        ref={containerRef}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6"
      >
        {/* Header with Category & Close button */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {receipt.category}
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {receipt.displayDate}
              </span>
            </div>
            <h2 id="modal-receipt-title" className="text-xl sm:text-2xl font-black text-white">
              {receipt.title}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {receipt.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative Description */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Story Context
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed">
            {sanitizeText(receipt.description)}
          </p>
        </div>

        {/* Financial & Location Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Financial Cost</span>
            <p className="text-base font-bold font-mono text-emerald-400 mt-0.5">
              {receipt.amount ? `₹${receipt.amount.toFixed(2)}` : 'Zero / Emotional'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Emotional Mood</span>
            <p className="text-base font-bold capitalize text-amber-300 mt-0.5">
              {receipt.mood}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Location</span>
            <p className="text-xs font-semibold text-slate-200 mt-1 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
              {receipt.location?.name || 'Digital Realm'}
            </p>
          </div>
        </div>

        {/* Metadata Details Table */}
        {receipt.metadata && Object.keys(receipt.metadata).length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Technical Metadata
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-xs">
              {Object.entries(receipt.metadata).map(([key, val]) => (
                <div key={key}>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <p className="font-semibold text-slate-200 truncate mt-0.5">
                    {String(val)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {receipt.tags && receipt.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {receipt.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Connected Story Moments */}
        {connectedMoments.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Network className="w-4 h-4 text-cyan-400" />
              Connected Moments in This Story Thread ({connectedMoments.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {connectedMoments.map((conn) => (
                <div
                  key={conn.id}
                  onClick={() => onSelectReceipt(conn)}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] uppercase font-bold text-amber-400">
                      {conn.category}
                    </span>
                    <p className="font-bold text-xs text-white group-hover:text-cyan-300 truncate">
                      {conn.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {conn.displayDate}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Provenance Footer */}
        <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-slate-400" />
            Verified Source: {receipt.rawSource?.toUpperCase() || 'SYNTHESIZED'}
          </span>
          <span className="font-mono">ID: {receipt.id}</span>
        </div>
      </div>
    </div>
  );
};
