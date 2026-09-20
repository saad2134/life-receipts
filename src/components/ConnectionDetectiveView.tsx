import React, { useState, useMemo } from 'react';
import { LifeReceipt, ReceiptCategory } from '../types/receipt';
import { useReceiptAudio } from '../hooks/useReceiptAudio';
import { sanitizeText } from '../services/security';
import confetti from 'canvas-confetti';
import {
  Compass,
  Footprints,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Search,
  Music,
  ShoppingBag,
  FileText,
  Camera,
  MapPin,
  Calendar,
  MessageSquare,
  Film,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

interface InvestigationChainDef {
  id: string;
  title: string;
  subtitle: string;
  caseCode: string;
  temporalWindow: string;
  confidenceScore: number;
  caseSynopsis: string;
  steps: {
    category: ReceiptCategory;
    roleLabel: string;
    forensicContext: string;
    preferredId?: string;
    preferredKeyword?: string;
  }[];
  synthesisStory: string;
}

const INVESTIGATION_CHAINS: InvestigationChainDef[] = [
  {
    id: 'koramangala-pivot',
    title: 'The 2 AM Koramangala Pivot',
    subtitle: 'Late-night existential crisis transformed into an indie venture',
    caseCode: 'CASE-084-STARTUP',
    temporalWindow: '14 Nov 2023, 01:45 AM – 04:30 AM (2h 45m)',
    confidenceScore: 98,
    caseSynopsis:
      'Five seemingly disparate digital breadcrumbs—a private late-night search, a looping dream-pop track, an emergency cold brew order, a rapid scratchpad note, and an early dawn whiteboard snap—uncover the exact moment a corporate engineer decided to resign and build an independent venture.',
    steps: [
      {
        category: 'search',
        roleLabel: '1. The Trigger Search',
        forensicContext:
          'At 1:45 AM, private browsing recorded an urgent query researching startup runway formulas and resignation protocols. This is the initial cognitive spark.',
        preferredKeyword: 'runway',
      },
      {
        category: 'music',
        roleLabel: '2. The Atmospheric Score',
        forensicContext:
          'Minutes later, Lana Del Rey’s "Born To Die" was placed on endless loop on desktop headphones. Acoustic tempo matched the psychological tension of making a life leap.',
        preferredKeyword: 'born to die',
      },
      {
        category: 'purchase',
        roleLabel: '3. Fuel for the Decision',
        forensicContext:
          'At 2:30 AM, an artisanal cold brew transaction cleared via UPI in Koramangala. A physical fuel receipt anchoring the late-night vigil.',
        preferredKeyword: 'coffee',
      },
      {
        category: 'note',
        roleLabel: '4. The Strategic Scratchpad',
        forensicContext:
          'By 3:15 AM, raw thoughts organized into a 2-year runway financial model and architecture blueprint inside Notes app.',
        preferredKeyword: 'runway',
      },
      {
        category: 'photo',
        roleLabel: '5. Visual Epilogue',
        forensicContext:
          'As dawn broke over Bengaluru at 4:30 AM, an iPhone lens captured the ink-stained whiteboard architecture. The decision was sealed.',
        preferredKeyword: 'whiteboard',
      },
    ],
    synthesisStory:
      'Together, these 5 receipts establish beyond doubt that human milestones are rarely single transactions—they are multi-sensory chains starting in the quiet doubt of a search bar, scored by music, sustained by coffee, recorded in notes, and immortalized in photos.',
  },
  {
    id: 'monsoon-transit',
    title: 'Monsoon Transit to Sea',
    subtitle: 'Sensory overload leading to an impromptu coastal sanctuary journey',
    caseCode: 'CASE-112-COAST',
    temporalWindow: '08 Jul 2023 – 10 Jul 2023 (48 Hours)',
    confidenceScore: 94,
    caseSynopsis:
      'Urban burnout and monsoonal rain converged into a spontaneous train ticket booking to the western cliffs, punctuated by introspective ambient acoustics and handwritten reflections.',
    steps: [
      {
        category: 'place',
        roleLabel: '1. The Departure Terminal',
        forensicContext:
          'GPS footprint locks onto KSR Bengaluru Railway Station platform 4 amidst heavy rain, logging departure from urban tech hub.',
        preferredKeyword: 'railway',
      },
      {
        category: 'music',
        roleLabel: '2. Rhythmic Soundtrack',
        forensicContext:
          'As rails clattered southward through the Western Ghats, dream-pop reverbs in Beach House "Space Song" isolated the traveller from the noisy sleeper coach.',
        preferredKeyword: 'space song',
      },
      {
        category: 'purchase',
        roleLabel: '3. Transit Sustenance',
        forensicContext:
          'Hot spiced chai and roasted peanuts bought at a foggy hill-station halt at 5:20 AM, providing warm tactile comfort.',
        preferredKeyword: 'tea',
      },
      {
        category: 'photo',
        roleLabel: '4. The Horizon Discovery',
        forensicContext:
          'High resolution photo logged from Kudle Beach cliffs catching first glimpse of Arabian sea mist parting before sunset.',
        preferredKeyword: 'cliff',
      },
      {
        category: 'note',
        roleLabel: '5. Clarity of Solitude',
        forensicContext:
          'Offline personal journal entry: "The mind gets quiet when salt air touches it. The city noise has finally dissolved."',
        preferredKeyword: 'mind',
      },
    ],
    synthesisStory:
      'A travel receipt is never just a ticket; it is an emotional exit strategy. Tracing the trajectory from noisy train platform to quiet cliffside note reveals how physical geography mirrors internal emotional states.',
  },
  {
    id: 'midnight-deep-work',
    title: 'Midnight Deep Work Sprint',
    subtitle: 'The 4-hour hyper-focus marathon that shipped the core release',
    caseCode: 'CASE-045-FLOW',
    temporalWindow: '03 Oct 2023, 11:30 PM – 03:45 AM',
    confidenceScore: 96,
    caseSynopsis:
      'Uninterrupted late-night technical creation where deep instrumental soundscapes, technical documentation searches, commit notes, and recovery nourishment formed an unbroken flow state.',
    steps: [
      {
        category: 'music',
        roleLabel: '1. Flow State Catalyst',
        forensicContext:
          'Tycho’s ambient electronic album queued on repeat, scientifically proven to suppress cortisol and elevate cognitive focus.',
        preferredKeyword: 'awake',
      },
      {
        category: 'search',
        roleLabel: '2. Deep Tech Investigation',
        forensicContext:
          'Rapid querying of React concurrent rendering edge cases and Web Audio API node scheduling constraints.',
        preferredKeyword: 'react',
      },
      {
        category: 'note',
        roleLabel: '3. Architectural Blueprint',
        forensicContext:
          'Markdown architecture draft detailing data sanitation pipelines and zero-latency audio dispatch.',
        preferredKeyword: 'architecture',
      },
      {
        category: 'purchase',
        roleLabel: '4. Midnight Refuel',
        forensicContext:
          'Online food delivery receipt for late-night protein meal and matcha green tea, keeping cognitive stamina peaked.',
        preferredKeyword: 'snack',
      },
      {
        category: 'event',
        roleLabel: '5. Global Deployment',
        forensicContext:
          'Calendar event trigger marking production deployment and global launch announcement.',
        preferredKeyword: 'launch',
      },
    ],
    synthesisStory:
      'High-performance work leaves a distinct multi-domain signature: instrumental rhythm replaces podcasts, searches deepen into specifications, and purchases shift from dining to utilitarian brain fuel.',
  },
  {
    id: 'family-health-reset',
    title: 'Family Health & Weekend Reset',
    subtitle: 'Stepping back from screens to preserve the relationships that matter',
    caseCode: 'CASE-209-CARE',
    temporalWindow: '18 Dec 2023, 08:00 AM – 06:00 PM',
    confidenceScore: 92,
    caseSynopsis:
      'When an elder family member fell ill, screen-time vanished. The digital breadcrumbs shift to pharmacy doorstep receipts, comforting family voice notes, park strolls, and emotional gratitude.',
    steps: [
      {
        category: 'purchase',
        roleLabel: '1. Emergency Care Outlay',
        forensicContext:
          'Early morning pharmacy delivery receipt for chronic medication and blood glucose test strips.',
        preferredKeyword: 'pharmacy',
      },
      {
        category: 'message',
        roleLabel: '2. Reassurance Exchange',
        forensicContext:
          'Saved family WhatsApp message: "Doctor said all vitals are stable. Have some warm soup and rest beta."',
        preferredKeyword: 'mom',
      },
      {
        category: 'place',
        roleLabel: '3. Restorative Nature Walk',
        forensicContext:
          'Geolocation pin at Cubbon Park Bamboo Grove during peaceful post-lunch convalescent walk.',
        preferredKeyword: 'park',
      },
      {
        category: 'photo',
        roleLabel: '4. Memory Preservation',
        forensicContext:
          'Candid portrait snapshot capturing sunlight filtering through old veranda tiles as tea was served.',
        preferredKeyword: 'tea',
      },
      {
        category: 'note',
        roleLabel: '5. Perspective Reset',
        forensicContext:
          'Evening memo: "No code sprint or metric will ever outweigh sitting by someone you love when they are vulnerable."',
        preferredKeyword: 'perspective',
      },
    ],
    synthesisStory:
      'Technology records the heartbeat of care. In moments of familial vulnerability, consumer patterns drop, and every transaction, note, and message forms an intimate sanctuary of gratitude.',
  },
];

const CATEGORY_ICONS: Record<ReceiptCategory, React.ComponentType<{ className?: string }>> = {
  search: Search,
  music: Music,
  purchase: ShoppingBag,
  note: FileText,
  photo: Camera,
  place: MapPin,
  event: Calendar,
  message: MessageSquare,
  entertainment: Film,
};

interface ConnectionDetectiveViewProps {
  receipts: LifeReceipt[];
  onSelectReceipt: (receipt: LifeReceipt) => void;
}

export const ConnectionDetectiveView: React.FC<ConnectionDetectiveViewProps> = ({
  receipts,
  onSelectReceipt,
}) => {
  const [selectedChainId, setSelectedChainId] = useState<string>(INVESTIGATION_CHAINS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [caseSolved, setCaseSolved] = useState<boolean>(false);

  const { triggerReceiptSound } = useReceiptAudio();

  const activeChain = useMemo(() => {
    return INVESTIGATION_CHAINS.find((c) => c.id === selectedChainId) || INVESTIGATION_CHAINS[0];
  }, [selectedChainId]);

  // Match each step in the active chain to the best matching LifeReceipt
  const chainReceipts = useMemo(() => {
    return activeChain.steps.map((step) => {
      // 1. Try keyword in title or description or tags
      if (step.preferredKeyword) {
        const kw = step.preferredKeyword.toLowerCase();
        const match = receipts.find(
          (r) =>
            r.category === step.category &&
            (r.title.toLowerCase().includes(kw) ||
              r.description.toLowerCase().includes(kw) ||
              r.subtitle.toLowerCase().includes(kw) ||
              r.tags.some((t) => t.toLowerCase().includes(kw)))
        );
        if (match) return match;
      }

      // 2. Fallback to any receipt of matching category
      const catMatch = receipts.find((r) => r.category === step.category);
      if (catMatch) return catMatch;

      // 3. Fallback to synthetic receipt representation if dataset lacks category
      const fallback: LifeReceipt = {
        id: `synthetic-${step.category}-${activeChain.id}`,
        category: step.category,
        timestamp: new Date().toISOString(),
        displayDate: 'Retrospective Timeline Event',
        title: `${step.roleLabel} [Archived Evidence]`,
        subtitle: `Correlated Forensic Moment (${step.category})`,
        description: step.forensicContext,
        mood: 'contemplative',
        tags: [step.category, 'detective-link'],
        chapterId: 'detective',
        connectedReceiptIds: [],
        metadata: {},
      };
      return fallback;
    });
  }, [activeChain, receipts]);

  const activeReceipt = chainReceipts[currentStepIndex] || chainReceipts[0];
  const activeStep = activeChain.steps[currentStepIndex] || activeChain.steps[0];

  const handleSelectChain = (chainId: string) => {
    triggerReceiptSound('click');
    setSelectedChainId(chainId);
    setCurrentStepIndex(0);
    setCaseSolved(false);
  };

  const handleSelectStep = (index: number) => {
    triggerReceiptSound('click');
    setCurrentStepIndex(index);
  };

  const handleNextStep = () => {
    if (currentStepIndex < activeChain.steps.length - 1) {
      triggerReceiptSound('click');
      setCurrentStepIndex((prev) => prev + 1);
    } else if (currentStepIndex === activeChain.steps.length - 1 && !caseSolved) {
      triggerReceiptSound('print');
      setCaseSolved(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Confetti guard
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      triggerReceiptSound('click');
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <section
      aria-label="Connection Detective Mode"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300"
    >
      {/* Header Banner: Detective Case Files */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                <Footprints className="w-3.5 h-3.5 text-cyan-400" />
                CONNECTION DETECTIVE MODE
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {activeChain.caseCode}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Investigating Connected Digital Evidence
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Problem Statement Requirement: Discover how 5 unrelated digital receipts connect across
              categories to form one undeniable human milestone.
            </p>
          </div>

          {/* Chain Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {INVESTIGATION_CHAINS.map((chain) => {
              const isSelected = chain.id === selectedChainId;
              return (
                <button
                  key={chain.id}
                  onClick={() => handleSelectChain(chain.id)}
                  aria-pressed={isSelected}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <span>{chain.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Case Briefing Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{activeChain.temporalWindow}</span>
            <span>•</span>
            <span className="font-bold text-emerald-400">{activeChain.confidenceScore}% Connection Confidence</span>
          </div>
          <h3 className="text-lg font-bold text-white">{activeChain.title}</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            {activeChain.caseSynopsis}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Evidence Chain</span>
            <span className="text-sm font-black text-cyan-400 font-mono">5 Categories</span>
          </div>
        </div>
      </div>

      {/* Interactive Breadcrumb Stepper */}
      <nav
        aria-label="Investigation Evidence Stepper"
        className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-3 sm:p-4 backdrop-blur-md overflow-x-auto scrollbar-none"
      >
        <ol className="flex items-center justify-between min-w-[620px] gap-2">
          {activeChain.steps.map((step, idx) => {
            const Icon = CATEGORY_ICONS[step.category] || Compass;
            const isCurrent = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;

            return (
              <li key={idx} className="flex-1 flex items-center">
                <button
                  onClick={() => handleSelectStep(idx)}
                  className={`w-full flex items-center gap-2.5 p-2 sm:p-3 rounded-xl transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-amber-500/15 border-amber-400/80 text-amber-300 shadow-md ring-1 ring-amber-400/50'
                      : isCompleted
                      ? 'bg-slate-950/60 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div className="text-left min-w-0">
                    <p className="text-[10px] uppercase font-mono tracking-wider font-bold truncate flex items-center gap-1">
                      <Icon className="w-3 h-3 shrink-0" />
                      <span>{step.category}</span>
                    </p>
                    <p className="text-xs font-semibold text-white truncate">
                      {step.roleLabel.replace(/^\d+\.\s*/, '')}
                    </p>
                  </div>
                </button>

                {idx < activeChain.steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-600 mx-1 shrink-0" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Active Clue Forensic Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Forensic Clue Details */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-xs">
                #{currentStepIndex + 1}
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                  Forensic Clue {currentStepIndex + 1} of 5
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {activeStep.roleLabel}
                </h4>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
              {activeStep.category}
            </span>
          </div>

          {/* Forensic Linkage Analysis Note */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Forensic Linkage Reasoning</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {activeStep.forensicContext}
            </p>
          </div>

          {/* Stepper Navigation Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              aria-label="Previous Clue"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Clue</span>
            </button>

            <span className="text-xs font-mono text-slate-400">
              Clue {currentStepIndex + 1} of 5
            </span>

            <button
              onClick={handleNextStep}
              aria-label={currentStepIndex === activeChain.steps.length - 1 ? 'Solve Case' : 'Next Clue'}
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentStepIndex === activeChain.steps.length - 1
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20'
              }`}
            >
              <span>{currentStepIndex === activeChain.steps.length - 1 ? 'Solve Case 🎯' : 'Next Clue'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Correlated Receipt Card Anchor */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Anchored Life Receipt
            </span>
            <button
              onClick={() => onSelectReceipt(activeReceipt)}
              aria-label="Inspect anchored receipt in modal"
              className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect Full</span>
            </button>
          </div>

          {/* Receipt Preview Card */}
          <div
            onClick={() => onSelectReceipt(activeReceipt)}
            className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 hover:border-cyan-500/50 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-0.5 rounded-md font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {activeReceipt.category}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {activeReceipt.displayDate}
              </span>
            </div>

            <div>
              <h5 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                {activeReceipt.title}
              </h5>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {activeReceipt.subtitle}
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
              {sanitizeText(activeReceipt.description)}
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">
                Mood: <strong className="text-rose-300 capitalize">{activeReceipt.mood}</strong>
              </span>
              {activeReceipt.amount !== undefined && activeReceipt.amount > 0 && (
                <span className="font-mono font-bold text-emerald-400">
                  ₹{activeReceipt.amount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Solved Case Synthesis Story Banner */}
      {caseSolved && (
        <div className="bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              ✓
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                Investigation Complete
              </span>
              <h4 className="text-xl font-black text-white">
                Case Synthesis: {activeChain.title}
              </h4>
            </div>
          </div>

          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed max-w-4xl">
            {activeChain.synthesisStory}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 font-bold">
              5 of 5 Clues Verified • 0 Contradictions • Storyline Reconstructed
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
