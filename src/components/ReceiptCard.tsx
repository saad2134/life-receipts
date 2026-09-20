import React from 'react';
import { LifeReceipt } from '../types/receipt';
import {
  Music,
  Tv,
  MapPin,
  ShoppingBag,
  Camera,
  MessageSquare,
  SearchCode,
  Calendar,
  FileText,
  Network,
  Clock,
} from 'lucide-react';
import { sanitizeText } from '../services/security';

interface ReceiptCardProps {
  receipt: LifeReceipt;
  onSelectReceipt: (receipt: LifeReceipt) => void;
  onTraceThread: (receipt: LifeReceipt) => void;
  isHighlighted?: boolean;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({
  receipt,
  onSelectReceipt,
  onTraceThread,
  isHighlighted = false,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'music':
        return Music;
      case 'entertainment':
        return Tv;
      case 'place':
        return MapPin;
      case 'purchase':
        return ShoppingBag;
      case 'photo':
        return Camera;
      case 'message':
        return MessageSquare;
      case 'search':
        return SearchCode;
      case 'event':
        return Calendar;
      case 'note':
        return FileText;
      default:
        return FileText;
    }
  };

  const getMoodBadge = (mood: string) => {
    switch (mood) {
      case 'melancholic':
        return { label: '🌙 Melancholic', bg: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30' };
      case 'contemplative':
        return { label: '💭 Contemplative', bg: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30' };
      case 'peaceful':
        return { label: '🍃 Peaceful', bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30' };
      case 'energetic':
        return { label: '⚡ Energetic', bg: 'bg-amber-950/60 text-amber-300 border-amber-500/30' };
      case 'euphoric':
        return { label: '✨ Euphoric', bg: 'bg-purple-950/60 text-purple-300 border-purple-500/30' };
      case 'anxious':
        return { label: '⚠️ Anxious', bg: 'bg-rose-950/60 text-rose-300 border-rose-500/30' };
      default:
        return { label: mood, bg: 'bg-slate-900 text-slate-300 border-slate-700' };
    }
  };

  const Icon = getCategoryIcon(receipt.category);
  const moodBadge = getMoodBadge(receipt.mood);
  const connectionCount = receipt.connectedReceiptIds?.length || 0;

  return (
    <article
      tabIndex={0}
      aria-label={`Receipt: ${receipt.title}`}
      className={`group relative flex flex-col justify-between bg-slate-900/70 border rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer ${
        isHighlighted
          ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-2 ring-amber-400'
          : 'border-slate-800 hover:border-slate-700'
      }`}
      onClick={() => onSelectReceipt(receipt)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectReceipt(receipt);
        }
      }}
    >
      {/* Top Header: Category & Timestamp */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-slate-200">
            <Icon className="w-3.5 h-3.5 text-amber-400" />
            <span className="capitalize">{receipt.category}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Clock className="w-3 h-3 text-slate-400" />
            <time dateTime={receipt.timestamp}>{receipt.displayDate}</time>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1">
          {receipt.title}
        </h3>
        <p className="text-xs text-slate-400 font-mono mt-0.5 line-clamp-1">
          {receipt.subtitle}
        </p>

        {/* Safe Description */}
        <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
          {sanitizeText(receipt.description)}
        </p>
      </div>

      {/* Card Footer: Metadata, Amount, Mood, and Thread Trace */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {receipt.amount !== undefined && receipt.amount > 0 ? (
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
              ₹{receipt.amount.toLocaleString('en-IN')}
            </span>
          ) : (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${moodBadge.bg}`}>
              {moodBadge.label}
            </span>
          )}

          {receipt.location?.name && (
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block truncate max-w-[120px]">
              📍 {receipt.location.name}
            </span>
          )}
        </div>

        {/* Story Thread Trace Action Button */}
        {connectionCount > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTraceThread(receipt);
            }}
            aria-label={`Trace story thread with ${connectionCount} connected moments`}
            title="Trace connected moments in story graph"
            className="flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <Network className="w-3 h-3" />
            <span>{connectionCount} links</span>
          </button>
        )}
      </div>
    </article>
  );
};
