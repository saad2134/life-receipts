import { useState, useMemo } from 'react';
import { LifeReceipt } from '../types/receipt';
import { synthesizeDynamicChapters } from '../services/correlationEngine';
import { useReceiptAudio } from '../hooks/useReceiptAudio';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  MapPin,
  Headphones,
} from 'lucide-react';
import { sanitizeText } from '../services/security';

interface ChapterStoryViewProps {
  receipts: LifeReceipt[];
  onSelectReceipt: (receipt: LifeReceipt) => void;
}

export const ChapterStoryView: React.FC<ChapterStoryViewProps> = ({
  receipts,
  onSelectReceipt,
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const chapters = useMemo(() => synthesizeDynamicChapters(receipts), [receipts]);
  const chapter = chapters[activeChapterIndex] || chapters[0];

  const {
    isNarrating,
    isAmbientOn,
    isMuted,
    playNarration,
    stopNarration,
    toggleAmbient,
    toggleMute,
  } = useReceiptAudio();

  const chapterReceipts = useMemo(() => {
    if (!chapter) return [];
    if (chapter.receiptIds && chapter.receiptIds.length > 0) {
      const idSet = new Set(chapter.receiptIds);
      return receipts.filter((r) => idSet.has(r.id));
    }
    return receipts.filter((r) => r.chapterId === chapter.id);
  }, [receipts, chapter]);

  const handleNext = () => {
    if (activeChapterIndex < chapters.length - 1) {
      stopNarration();
      setActiveChapterIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeChapterIndex > 0) {
      stopNarration();
      setActiveChapterIndex((prev) => prev - 1);
    }
  };

  const handleSelectChapter = (idx: number) => {
    if (idx !== activeChapterIndex) {
      stopNarration();
      setActiveChapterIndex(idx);
    }
  };

  if (!chapter) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-12 text-center text-slate-400">
        No chapter memories synthesized yet. Load life receipts to construct story chapters.
      </section>
    );
  }

  return (
    <section
      aria-label={`Story Chapter: ${chapter.title}`}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
    >
      {/* Chapter Navigation Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2">
          {chapters.map((ch, idx) => {
            const isCurrent = idx === activeChapterIndex;
            return (
              <button
                key={ch.id}
                onClick={() => handleSelectChapter(idx)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span>Ch {ch.number}</span>
                <span className="hidden sm:inline">• {ch.title}</span>
              </button>
            );
          })}
        </div>

        {/* Narrative & Multi-Sensory Audio Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => playNarration(chapter.narrative)}
            aria-label={isNarrating ? 'Stop story narration' : 'Play spoken narration'}
            title="Read chapter aloud with Web Speech API voice synthesis"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              isNarrating
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 border-slate-700/80 text-amber-400 hover:bg-slate-800'
            }`}
          >
            {isNarrating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isNarrating ? 'Stop Voice' : 'Play Narration'}</span>
          </button>
          <button
            onClick={toggleAmbient}
            aria-label={isAmbientOn ? 'Disable 432Hz ambient frequency' : 'Enable 432Hz ambient frequency'}
            title="Toggle 432Hz natural meditation synthesizer"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              isAmbientOn
                ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:text-white'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAmbientOn ? '432Hz On' : 'Ambient'}</span>
          </button>
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Hero Chapter Narrative Card */}
      <div
        className={`relative overflow-hidden rounded-3xl border border-slate-800 p-6 sm:p-10 bg-gradient-to-br ${chapter.bgGradient} shadow-2xl transition-all duration-300`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 space-y-6">
          {/* Tag & Time range */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/20">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              CHAPTER {chapter.number} OF {chapters.length}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {chapter.timeRange}
            </span>
          </div>

          {/* Chapter Title & Tagline */}
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {chapter.title}
            </h2>
            <p className="text-sm sm:text-base text-amber-300/90 font-medium mt-1">
              {chapter.tagline}
            </p>
          </div>

          {/* Narrative Body */}
          <div className="prose prose-invert max-w-none">
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {sanitizeText(chapter.narrative)}
            </p>
          </div>

          {/* Core Reflection Quote */}
          <blockquote className="border-l-2 border-amber-400 pl-4 py-1 italic text-sm text-amber-200/90 bg-amber-400/5 rounded-r-xl">
            “{chapter.reflection}”
          </blockquote>

          {/* Chapter Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div className="bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Moments</span>
              <p className="text-lg font-black text-white font-mono mt-0.5">
                {chapter.stats.receiptCount} Receipts
              </p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Outlay</span>
              <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                ₹{chapter.stats.totalSpend.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-white/5 col-span-2 sm:col-span-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Defining Soundtrack</span>
              <p className="text-xs font-bold text-amber-300 font-mono mt-1 truncate">
                🎵 {chapter.stats.topTrack}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Moments Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Receipts from this Chapter ({chapterReceipts.length})
          </h3>

          {/* Prev / Next chapter buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={activeChapterIndex === 0}
              aria-label="Previous Chapter"
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={activeChapterIndex === chapters.length - 1}
              aria-label="Next Chapter"
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {chapterReceipts.map((r) => (
            <div
              key={r.id}
              onClick={() => onSelectReceipt(r)}
              className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-amber-500/40 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                  <span className="capitalize font-semibold text-amber-400">{r.category}</span>
                  <span className="font-mono text-[10px]">{r.displayDate}</span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                  {r.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {r.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                {r.location?.name ? (
                  <span className="text-slate-400 flex items-center gap-1 truncate max-w-[150px]">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {r.location.name}
                  </span>
                ) : (
                  <span></span>
                )}

                {r.amount !== undefined && r.amount > 0 && (
                  <span className="font-mono font-bold text-emerald-400">
                    ₹{r.amount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
