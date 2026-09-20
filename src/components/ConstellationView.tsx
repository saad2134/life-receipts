import React from 'react';
import { LifeReceipt, DetectedPattern } from '../types/receipt';
import { discoverDynamicPatterns } from '../services/correlationEngine';
import {
  Sparkles,
  Network,
  ArrowRight,
  X,
  ZoomIn,
  ZoomOut,
  Eye,
} from 'lucide-react';

interface ConstellationViewProps {
  receipts: LifeReceipt[];
  onSelectReceipt: (receipt: LifeReceipt | null) => void;
  selectedReceipt: LifeReceipt | null;
}

export const ConstellationView: React.FC<ConstellationViewProps> = ({
  receipts,
  onSelectReceipt,
  selectedReceipt,
}) => {
  const discoveredPatterns = React.useMemo(() => {
    return discoverDynamicPatterns(receipts);
  }, [receipts]);

  const [activePattern, setActivePattern] = React.useState<DetectedPattern | null>(null);
  const [hoveredReceiptId, setHoveredReceiptId] = React.useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = React.useState<number>(1);

  // Sync currentPattern with discoveredPatterns
  const currentPattern = React.useMemo(() => {
    if (activePattern && discoveredPatterns.some((p) => p.id === activePattern.id)) {
      return activePattern;
    }
    return discoveredPatterns[0] || null;
  }, [activePattern, discoveredPatterns]);

  // Focus a specific receipt or pattern
  const activeReceiptIds = React.useMemo(() => {
    if (selectedReceipt) {
      return new Set([selectedReceipt.id, ...(selectedReceipt.connectedReceiptIds || [])]);
    }
    if (currentPattern) {
      return new Set(currentPattern.connectedReceiptIds);
    }
    return new Set<string>();
  }, [selectedReceipt, currentPattern]);

  // Large dataset density optimization: cluster top 45 anchor nodes when receipts > 50
  const isLargeDataset = receipts.length > 50;
  const displayReceipts = React.useMemo(() => {
    if (!isLargeDataset) return receipts;

    const MAX_NODES = 45;
    const selectedSet = new Set<string>();
    const anchors: LifeReceipt[] = [];

    // Priority 1: Selected receipt and its direct connections
    if (selectedReceipt) {
      anchors.push(selectedReceipt);
      selectedSet.add(selectedReceipt.id);
      (selectedReceipt.connectedReceiptIds || []).forEach((id) => {
        const found = receipts.find((r) => r.id === id);
        if (found && !selectedSet.has(found.id)) {
          anchors.push(found);
          selectedSet.add(found.id);
        }
      });
    }

    // Priority 2: Current pattern active cluster
    if (currentPattern) {
      currentPattern.connectedReceiptIds.forEach((id) => {
        if (anchors.length >= MAX_NODES) return;
        const found = receipts.find((r) => r.id === id);
        if (found && !selectedSet.has(found.id)) {
          anchors.push(found);
          selectedSet.add(found.id);
        }
      });
    }

    // Priority 3: Sample remaining slots evenly across all categories
    const step = Math.max(1, Math.floor(receipts.length / (MAX_NODES - anchors.length || 1)));
    for (let i = 0; i < receipts.length && anchors.length < MAX_NODES; i += step) {
      if (!selectedSet.has(receipts[i].id)) {
        anchors.push(receipts[i]);
        selectedSet.add(receipts[i].id);
      }
    }

    return anchors;
  }, [receipts, isLargeDataset, selectedReceipt, currentPattern]);

  // Layout node coordinates in a circular/orbital graph safely avoiding zero-division
  const nodeLayout = React.useMemo(() => {
    if (!displayReceipts || displayReceipts.length === 0) return [];
    const width = 800;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 200;
    const len = displayReceipts.length;

    return displayReceipts.map((r, idx) => {
      const angle = (idx / len) * 2 * Math.PI - Math.PI / 2;
      // Add slight jitter for natural constellation feel
      const dist = radius + ((idx % 3) - 1) * 35;
      const x = centerX + dist * Math.cos(angle);
      const y = centerY + dist * Math.sin(angle);
      return { receipt: r, x, y };
    });
  }, [displayReceipts]);

  // Compute edges between connected receipts
  const edges = React.useMemo(() => {
    const edgeList: { id: string; x1: number; y1: number; x2: number; y2: number; isHighlighted: boolean }[] = [];
    const nodeMap = new Map(nodeLayout.map((n) => [n.receipt.id, n]));

    nodeLayout.forEach((sourceNode) => {
      sourceNode.receipt.connectedReceiptIds?.forEach((targetId) => {
        const targetNode = nodeMap.get(targetId);
        if (targetNode && sourceNode.receipt.id < targetId) {
          const isHighlighted =
            activeReceiptIds.has(sourceNode.receipt.id) && activeReceiptIds.has(targetId);
          edgeList.push({
            id: `${sourceNode.receipt.id}-${targetId}`,
            x1: sourceNode.x,
            y1: sourceNode.y,
            x2: targetNode.x,
            y2: targetNode.y,
            isHighlighted,
          });
        }
      });
    });

    return edgeList;
  }, [nodeLayout, activeReceiptIds]);

  // Dynamic zoom calculations
  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.0, Math.round((z + 0.25) * 100) / 100));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.75, Math.round((z - 0.25) * 100) / 100));
  const handleResetZoom = () => setZoomLevel(1);

  const viewBox = React.useMemo(() => {
    const baseW = 800;
    const baseH = 500;
    const w = baseW / zoomLevel;
    const h = baseH / zoomLevel;
    const x = (baseW - w) / 2;
    const y = (baseH - h) / 2;
    return `${x} ${y} ${w} ${h}`;
  }, [zoomLevel]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'music':
        return '#6366f1'; // Indigo
      case 'entertainment':
        return '#8b5cf6'; // Purple
      case 'place':
        return '#06b6d4'; // Cyan
      case 'purchase':
        return '#10b981'; // Emerald
      case 'photo':
        return '#ec4899'; // Pink
      case 'message':
        return '#f59e0b'; // Amber
      case 'search':
        return '#3b82f6'; // Blue
      case 'event':
        return '#eab308'; // Yellow
      case 'note':
        return '#f43f5e'; // Rose
      default:
        return '#94a3b8';
    }
  };

  return (
    <section
      aria-label="Memory Constellation Graph"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4"
    >
      {/* Pattern Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <Network className="w-3.5 h-3.5 text-cyan-400" />
          Discovered Patterns:
        </span>
        {discoveredPatterns.map((pattern) => {
          const isSelected = currentPattern?.id === pattern.id && !selectedReceipt;
          return (
            <button
              key={pattern.id}
              onClick={() => {
                setActivePattern(pattern);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{pattern.title}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-cyan-200 font-mono">
                {pattern.confidenceScore}% match
              </span>
            </button>
          );
        })}
      </div>

      {/* Large Dataset Density Indicator */}
      {isLargeDataset && (
        <div className="flex items-center gap-2 text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-3.5 py-2 rounded-2xl">
          <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Displaying {displayReceipts.length} anchor nodes from {receipts.length} moments • Filter or click any moment to inspect specific clusters
          </span>
        </div>
      )}

      {/* Active Pattern or Selected Receipt Detail Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
              {selectedReceipt ? 'Single Moment Anchor' : `Pattern: ${currentPattern?.category.toUpperCase() || 'SYNTHESIS'}`}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-[11px] text-slate-400">
              {activeReceiptIds.size} connected life moments illuminated
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-0.5">
            {selectedReceipt ? selectedReceipt.title : currentPattern?.title || 'Harmonized Memory Graph'}
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
            {selectedReceipt ? selectedReceipt.description : currentPattern?.description || 'Relationships between moments across your digital retrospective.'}
          </p>
        </div>

        {selectedReceipt && (
          <button
            onClick={() => onSelectReceipt(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset to Patterns</span>
          </button>
        )}
      </div>

      {/* The Interactive SVG Constellation Canvas with Interactive Zoom */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[540px] bg-slate-950/90 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center p-2">
        {/* Interactive Zoom Controls */}
        <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-800 backdrop-blur-md p-1 rounded-xl flex items-center gap-1 z-20 shadow-lg">
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 2}
            aria-label="Zoom in constellation graph"
            title="Zoom In"
            className="min-w-[36px] min-h-[36px] flex items-center justify-center p-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.75}
            aria-label="Zoom out constellation graph"
            title="Zoom Out"
            className="min-w-[36px] min-h-[36px] flex items-center justify-center p-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            aria-label="Reset zoom to 100%"
            title="Reset Zoom (100%)"
            className="min-w-[36px] min-h-[36px] flex items-center justify-center px-2 py-0.5 text-[10px] font-mono text-cyan-300 font-bold hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
        </div>

        {receipts.length === 0 ? (
          <div className="text-center py-24 space-y-2">
            <p className="text-slate-400 text-sm font-semibold">
              No constellation moments to display.
            </p>
            <p className="text-slate-400 text-xs">
              Load or select receipts to illuminate the relationship graph.
            </p>
          </div>
        ) : (
          <svg
            viewBox={viewBox}
            className="w-full h-full select-none transition-all duration-300"
            role="img"
            aria-label="Interactive Constellation Graph connecting receipts"
          >
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background constellation stars */}
            {Array.from({ length: 40 }).map((_, i) => (
              <circle
                key={i}
                cx={(i * 197) % 800}
                cy={(i * 123) % 500}
                r={0.8}
                fill="#94a3b8"
                opacity={0.3}
              />
            ))}

            {/* Connection Edges */}
            <g>
              {edges.map((edge) => (
                <line
                  key={edge.id}
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  stroke={edge.isHighlighted ? '#38bdf8' : '#334155'}
                  strokeWidth={edge.isHighlighted ? 2.5 : 0.8}
                  strokeOpacity={edge.isHighlighted ? 0.9 : 0.25}
                  strokeDasharray={edge.isHighlighted ? 'none' : '2,3'}
                  filter={edge.isHighlighted ? 'url(#glow)' : undefined}
                  className="transition-all duration-300"
                />
              ))}
            </g>

            {/* Nodes */}
            <g>
              {nodeLayout.map(({ receipt, x, y }) => {
                const isAnchor = selectedReceipt?.id === receipt.id;
                const isConnected = activeReceiptIds.has(receipt.id);
                const isHovered = hoveredReceiptId === receipt.id;
                const color = getCategoryColor(receipt.category);

                return (
                  <g
                    key={receipt.id}
                    transform={`translate(${x}, ${y})`}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => onSelectReceipt(receipt)}
                    onMouseEnter={() => setHoveredReceiptId(receipt.id)}
                    onMouseLeave={() => setHoveredReceiptId(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${receipt.category}: ${receipt.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSelectReceipt(receipt);
                    }}
                  >
                    {/* Outer glow ring if active */}
                    {(isAnchor || isConnected || isHovered) && (
                      <circle
                        r={isAnchor ? 18 : 14}
                        fill={color}
                        opacity={0.25}
                        filter="url(#glow)"
                        className={isHovered ? 'animate-pulse' : ''}
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      r={isAnchor ? 10 : isConnected ? 8 : 5}
                      fill={color}
                      stroke={isAnchor ? '#ffffff' : '#0f172a'}
                      strokeWidth={isAnchor ? 2.5 : 1.5}
                      className="transition-all duration-200"
                    />

                    {/* Text Label on Hover or Active */}
                    {(isAnchor || isHovered || isConnected) && (
                      <text
                        y={isAnchor ? -16 : -12}
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize={isAnchor ? '11px' : '9px'}
                        fontWeight="bold"
                        className="pointer-events-none drop-shadow-md font-sans"
                      >
                        {receipt.title.length > 20
                          ? receipt.title.slice(0, 18) + '..'
                          : receipt.title}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        )}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] text-slate-300 flex items-center gap-3">
          <span className="font-bold text-slate-400">Legend:</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Music
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Purchase
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span> Place
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-pink-500"></span> Photo
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Message
          </span>
        </div>
      </div>

      {/* Connected Thread Timeline Breakdown */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Chronological Thread Sequence
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {receipts
            .filter((r) => activeReceiptIds.has(r.id))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .map((r, idx, arr) => (
              <div
                key={r.id}
                onClick={() => onSelectReceipt(r)}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                    <span className="uppercase text-amber-400 font-bold">
                      Step {idx + 1} of {arr.length}
                    </span>
                    <span>{r.displayDate.split(',')[1] || r.displayDate}</span>
                  </div>
                  <h4 className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {r.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {r.description}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
                  <span className="capitalize text-slate-400">{r.category}</span>
                  <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Details <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
