import React from 'react';
import { LifeReceipt } from '../types/receipt';
import { X, Upload, CheckCircle2, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { validateDatasetStructure } from '../services/security';

interface DatasetUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetLoad: (receipts: LifeReceipt[]) => void;
  onResetDefault: () => void;
  currentCount: number;
}

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

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!validateDatasetStructure(parsed)) {
          setErrorMsg(
            'Invalid dataset structure. Expected an array of receipts with id, category, title, and timestamp.'
          );
          return;
        }

        onDatasetLoad(parsed as LifeReceipt[]);
        setSuccessMsg(`Successfully imported ${parsed.length} custom life receipts!`);
      } catch (err) {
        setErrorMsg('Failed to parse file. Please upload a valid JSON dataset file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="uploader-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-5">
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
                Rule 7 & 9 Compliance: Load or switch life datasets
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
              Active Dataset
            </span>
            <p className="text-sm font-bold text-white mt-0.5">
              Harmonized Digital Life Archives
            </p>
            <p className="text-xs text-slate-400">
              {currentCount} moments across all 9 categories
            </p>
          </div>
          <button
            onClick={() => {
              onResetDefault();
              setSuccessMsg('Reset to official default dataset successfully.');
              setErrorMsg(null);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
        </div>

        {/* Custom JSON Uploader */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            Import Custom JSON Dataset
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/50"
          >
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-200">
              Click to select or drop a JSON dataset file
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports LifeReceipt[] array format
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
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
