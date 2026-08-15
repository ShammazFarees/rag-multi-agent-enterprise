import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bookmark, FileText, ShieldCheck, Copy, Check } from 'lucide-react';

export default function CitationModal() {
  const { selectedCitation, setSelectedCitation } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!selectedCitation) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedCitation.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden glass-panel">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-cyan-950/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                Grounding Source Citation
              </h3>
              <p className="text-xs text-cyan-300 font-mono">
                {selectedCitation.doc_name} • {selectedCitation.page_or_section}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedCitation(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {/* Metadata Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Document Name</span>
              <span className="text-xs font-semibold text-slate-200 truncate block mt-0.5">
                {selectedCitation.doc_name}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Vector Similarity Score</span>
              <span className="text-xs font-bold text-cyan-400 font-mono block mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {(selectedCitation.similarity_score * 100).toFixed(1)}% Match
              </span>
            </div>
          </div>

          {/* Snippet Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>Exact Chunk Context Snippet:</span>
              <button
                onClick={handleCopy}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy Snippet'}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
              "{selectedCitation.snippet}"
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={() => setSelectedCitation(null)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Close Citation
          </button>
        </div>
      </div>
    </div>
  );
}
