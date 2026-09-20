import React from 'react';
import { LifeStats } from '../types/receipt';
import { Clock, IndianRupee, Layers, Sparkles, Compass } from 'lucide-react';

interface StatsBannerProps {
  stats: LifeStats;
  onOpenConstellation: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ stats, onOpenConstellation }) => {
  const statItems = [
    {
      label: 'Digital Receipts',
      value: stats.totalReceipts.toString(),
      subtext: 'Across 9 Categories',
      icon: Layers,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Financial Footprint',
      value: `₹${stats.totalSpend.toLocaleString('en-IN')}`,
      subtext: 'Tracked Outlay',
      icon: IndianRupee,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Most Active Hour',
      value: stats.mostActiveHour,
      subtext: 'Night Solitude Peak',
      icon: Clock,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      label: 'Dominant Vibe',
      value: stats.dominantMood.toUpperCase(),
      subtext: 'Emotional Frequency',
      icon: Sparkles,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      label: 'Story Patterns',
      value: `${stats.connectedThreadsCount} Threads`,
      subtext: 'Cross-Domain Insights',
      icon: Compass,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      action: onOpenConstellation,
      actionText: 'View Graph →',
    },
  ];

  return (
    <section
      aria-label="Digital Life Summary Stats"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 no-print"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-3 sm:p-4 rounded-xl border backdrop-blur-md bg-slate-900/60 hover:bg-slate-900/90 transition-all flex flex-col justify-between ${
                item.action ? 'cursor-pointer hover:border-cyan-500/50 group' : 'border-slate-800/80'
              }`}
              onClick={item.action}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-slate-400 tracking-wide">
                  {item.label}
                </span>
                <div className={`p-1.5 rounded-lg border ${item.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
                  {item.value}
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[10px] text-slate-400">{item.subtext}</span>
                  {item.actionText && (
                    <span className="text-[10px] text-cyan-400 font-bold group-hover:underline">
                      {item.actionText}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
