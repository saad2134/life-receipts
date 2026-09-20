import React from 'react';
import { LifeReceipt } from '../types/receipt';
import { compileReceiptTape } from '../services/correlationEngine';
import confetti from 'canvas-confetti';
import { Printer, Sparkles, Scissors } from 'lucide-react';

interface ReceiptTapeViewProps {
  receipts: LifeReceipt[];
  onSelectReceipt: (receipt: LifeReceipt) => void;
}

export const ReceiptTapeView: React.FC<ReceiptTapeViewProps> = ({
  receipts,
  onSelectReceipt,
}) => {
  const [isTorn, setIsTorn] = React.useState(false);
  const breakdown = React.useMemo(() => compileReceiptTape(receipts), [receipts]);

  const handleTear = () => {
    setIsTorn(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#10b981', '#6366f1', '#f43f5e'],
    });
    setTimeout(() => setIsTorn(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section
      aria-label="Thermal Receipt Tape"
      className="flex flex-col items-center justify-center py-6 px-4"
    >
      {/* Tape Controls Bar */}
      <div className="flex items-center gap-3 mb-6 no-print">
        <button
          onClick={handleTear}
          aria-label="Tear and save receipt"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Scissors className="w-4 h-4" />
          <span>Tear Receipt Tape</span>
        </button>
        <button
          onClick={handlePrint}
          aria-label="Print physical receipt"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* The Physical Receipt Container */}
      <div
        className={`w-full max-w-md transition-transform duration-500 ease-out ${
          isTorn ? 'translate-y-4 scale-[0.98]' : ''
        }`}
      >
        {/* Top Perforated Edge */}
        <div className="receipt-tear-top" aria-hidden="true"></div>

        {/* Receipt Paper Body */}
        <div className="receipt-paper p-6 sm:p-8 font-mono text-xs leading-relaxed select-text shadow-2xl relative">
          {/* Header */}
          <div className="text-center space-y-1 pb-4 border-b border-dashed border-stone-400">
            <div className="text-xl font-black tracking-widest uppercase text-stone-900">
              LIFE ARCHIVE
            </div>
            <p className="text-[10px] text-stone-500 tracking-wider">
              YOUR LIFE, IN RECEIPTS • ARCHIVE RETROSPECTIVE
            </p>
            <p className="text-[10px] text-stone-500">
              TERMINAL: {breakdown.terminalId}
            </p>
            <p className="text-[10px] text-stone-500">
              DATE: {breakdown.dateStr}
            </p>
          </div>

          {/* Table Header */}
          <div className="py-3 border-b border-dashed border-stone-400 flex items-center justify-between text-[11px] font-bold text-stone-800">
            <span className="w-16">TYPE</span>
            <span className="flex-1 px-2">MOMENT</span>
            <span className="w-16 text-right">VALUE</span>
          </div>

          {/* Line Items List */}
          <div className="divide-y divide-dashed divide-stone-300 py-2">
            {receipts.map((r) => (
              <div
                key={r.id}
                tabIndex={0}
                role="button"
                onClick={() => onSelectReceipt(r)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSelectReceipt(r);
                }}
                className="py-2.5 flex items-center justify-between hover:bg-stone-100/80 px-1 rounded transition-colors cursor-pointer group"
                title="Click to view details"
              >
                <span className="w-16 text-[10px] font-bold text-stone-600 uppercase">
                  {r.category.slice(0, 6)}
                </span>
                <div className="flex-1 px-2 min-w-0">
                  <p className="text-[11px] font-bold text-stone-900 truncate group-hover:text-amber-700">
                    {r.title}
                  </p>
                  <p className="text-[9px] text-stone-500 truncate">
                    {r.displayDate}
                  </p>
                </div>
                <span className="w-16 text-right text-[11px] font-mono font-bold text-stone-900">
                  {r.amount !== undefined && r.amount > 0
                    ? `₹${r.amount.toFixed(2)}`
                    : 'FREE'}
                </span>
              </div>
            ))}
          </div>

          {/* Totals & Tax Breakdown */}
          <div className="pt-4 border-t-2 border-stone-800 space-y-1.5 text-stone-800">
            <div className="flex justify-between text-[11px]">
              <span>MOMENTS COUNT:</span>
              <span className="font-bold">{receipts.length} UNITS</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>FINANCIAL SUB-TOTAL:</span>
              <span className="font-bold">₹{breakdown.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>NOSTALGIA TAX (18%):</span>
              <span className="font-bold">₹{breakdown.lifeTax.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-dashed border-stone-400 flex justify-between text-sm font-black text-stone-950">
              <span>TOTAL EMOTIONAL VALUE:</span>
              <span>PRICELESS</span>
            </div>
          </div>

          {/* Barcode Section */}
          <div className="pt-6 pb-2 text-center border-t border-dashed border-stone-400 mt-6 space-y-2">
            {/* Authentic Simulated 1D Barcode */}
            <div
              className="h-10 mx-auto flex items-stretch justify-center gap-[2px] overflow-hidden max-w-[260px] opacity-85"
              aria-hidden="true"
            >
              {[
                2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 1, 3, 2, 1, 4, 2, 1, 3, 2, 1, 1, 3, 2,
                4, 1, 2, 3, 1, 2, 4, 1, 3, 1, 2, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3,
              ].map((w, idx) => (
                <div
                  key={idx}
                  style={{ width: `${w}px` }}
                  className="bg-stone-900 h-full"
                ></div>
              ))}
            </div>
            <p className="text-[9px] tracking-widest text-stone-600">
              {breakdown.barcodeValue}
            </p>
            <div className="pt-2 flex items-center justify-center gap-1 text-[10px] text-stone-500">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>THANK YOU FOR LIVING THESE MOMENTS</span>
            </div>
          </div>
        </div>

        {/* Bottom Perforated Edge */}
        <div className="receipt-tear-bottom" aria-hidden="true"></div>
      </div>
    </section>
  );
};
