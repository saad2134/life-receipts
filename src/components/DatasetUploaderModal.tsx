import React from 'react';
import { LifeReceipt } from '../types/receipt';
import {
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileText,
  Music,
  ShoppingBag,
  CreditCard,
  Layers,
} from 'lucide-react';
import { parseUploadedDataset, autoLinkTemporalReceipts } from '../services/datasetParser';
import {
  SAMPLE_SPOTIFY_RECEIPTS,
  SAMPLE_HOUSEHOLD_RECEIPTS,
  SAMPLE_INDIA_TRANSACT_RECEIPTS,
} from '../data/sampleOrganizerDatasets';
import { INITIAL_LIFE_RECEIPTS } from '../data/lifeReceiptsData';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface DatasetUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetLoad: (receipts: LifeReceipt[]) => void;
  onResetDefault: () => void;
  currentCount: number;
}

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB safety limit

export const DatasetUploaderModal: React.FC<DatasetUploaderModalProps> = ({
  isOpen,
  onClose,
  onDatasetLoad,
  onResetDefault,
  currentCount,
}) => {
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Accessible Focus Trap inside modal
  const containerRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Safety check: 25MB file size constraint
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg('File size exceeds the 25MB safety limit. Please upload a smaller dataset.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsedReceipts = parseUploadedDataset(text, file.name);

        if (parsedReceipts.length === 0) {
          setErrorMsg('No valid life receipts could be parsed from this file.');
          return;
        }

        onDatasetLoad(parsedReceipts);
        setSuccessMsg(`Successfully imported ${parsedReceipts.length} life moments from ${file.name}!`);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to parse file.';
        setErrorMsg(message);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Error reading file from disk.');
    };
    reader.readAsText(file);
  };

  const handlePresetLoad = (type: 'default' | 'spotify' | 'household' | 'india') => {
    setErrorMsg(null);
    if (type === 'default') {
      onResetDefault();
      setSuccessMsg(`Loaded default harmonized life archive (${INITIAL_LIFE_RECEIPTS.length} moments across 9 domains).`);
    } else if (type === 'spotify') {
      onDatasetLoad(autoLinkTemporalReceipts(SAMPLE_SPOTIFY_RECEIPTS));
      setSuccessMsg(`Loaded Spotify Streaming History preset (${SAMPLE_SPOTIFY_RECEIPTS.length} moments).`);
    } else if (type === 'household') {
      onDatasetLoad(autoLinkTemporalReceipts(SAMPLE_HOUSEHOLD_RECEIPTS));
      setSuccessMsg(`Loaded Daily Household Transactions preset (${SAMPLE_HOUSEHOLD_RECEIPTS.length} moments).`);
    } else if (type === 'india') {
      onDatasetLoad(autoLinkTemporalReceipts(SAMPLE_INDIA_TRANSACT_RECEIPTS));
      setSuccessMsg(`Loaded India Transact Multi-Facet preset (${SAMPLE_INDIA_TRANSACT_RECEIPTS.length} moments).`);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="uploader-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        ref={containerRef}
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 id="uploader-modal-title" className="text-lg font-bold text-white">
                Dataset Management
              </h2>
              <p className="text-xs text-slate-400">
                FAIE Parameter 6 Compliance: Load custom files or official hackathon datasets
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current status */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Active Archive State
            </span>
            <p className="text-sm font-bold text-white mt-0.5">
              Active Digital Retrospective
            </p>
            <p className="text-xs text-slate-400">
              {currentCount} life moments loaded and correlated
            </p>
          </div>
          <button
            onClick={() => handlePresetLoad('default')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
        </div>

        {/* 1-Click Preset Quick Switchers */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            1-Click Dataset Quick Switchers (Evaluator Ready)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handlePresetLoad('default')}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-amber-300">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Default Harmonized Archive</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Full 9 domains with story chapters & constellation
              </p>
            </button>

            <button
              type="button"
              onClick={() => handlePresetLoad('spotify')}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-indigo-300">
                <Music className="w-4 h-4 text-indigo-400" />
                <span>Spotify Streaming History</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                From spotify_history.csv with late-night tracks
              </p>
            </button>

            <button
              type="button"
              onClick={() => handlePresetLoad('household')}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-emerald-300">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Daily Household Transactions</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                From Daily Household Transactions.csv (INR)
              </p>
            </button>

            <button
              type="button"
              onClick={() => handlePresetLoad('india')}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-cyan-300">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>India Transact Multi-Facet</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                From IndiaTransactMultiFacet2024.json
              </p>
            </button>
          </div>
        </div>

        {/* Custom File Uploader */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            Upload Custom File (JSON / CSV)
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-slate-950/50"
          >
            <Upload className="w-7 h-7 text-slate-400 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-slate-200">
              Click to browse or drop any JSON or CSV dataset file
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Auto-detects Spotify CSV, Household CSV, India Transact JSON, and LifeReceipt[] (Max 25MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.csv,.tsv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Feedback messages */}
        {successMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
