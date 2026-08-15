import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  UploadCloud, 
  Trash2, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  FileSpreadsheet, 
  FileCode,
  HardDrive,
  Activity,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const { 
    documents, 
    activeProvider, 
    isUploading, 
    handleUploadFiles, 
    handleDeleteDocument, 
    handleResetDemo 
  } = useApp();

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const totalChunks = documents.reduce((sum, d) => sum + d.chunk_count, 0);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadFiles(e.target.files);
    }
  };

  const getFileBadge = (fileType) => {
    const type = fileType ? fileType.toUpperCase() : 'TXT';
    if (type === 'PDF') return <span className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[9px] font-bold font-mono text-red-400">PDF</span>;
    if (type === 'CSV') return <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold font-mono text-emerald-400">CSV</span>;
    if (type === 'DOCX') return <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold font-mono text-blue-400">DOCX</span>;
    return <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-bold font-mono text-cyan-400">TXT</span>;
  };

  const getFileIcon = (fileType) => {
    const type = fileType ? fileType.toUpperCase() : 'TXT';
    if (type === 'PDF') return <FileText className="w-4 h-4 text-red-400" />;
    if (type === 'CSV') return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
    if (type === 'DOCX') return <FileCode className="w-4 h-4 text-blue-400" />;
    return <FileText className="w-4 h-4 text-cyan-400" />;
  };

  return (
    <aside className="w-80 h-full bg-slate-950/90 border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none glass-panel">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight gradient-text">
              DocuMind AI
            </h1>
            <p className="text-[11px] text-indigo-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Enterprise RAG & Agent
            </p>
          </div>
        </div>

        {/* AI Provider Status Pill */}
        <div className="mt-3 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs shadow-inner">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="text-slate-300 font-mono text-[11px] truncate">{activeProvider}</span>
          </div>
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {/* Upload Zone */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
              Document Ingestion
            </span>
            <div className="flex gap-1">
              {['PDF', 'TXT', 'CSV', 'DOCX'].map(ext => (
                <span key={ext} className="text-[9px] font-mono text-slate-500 uppercase">{ext}</span>
              ))}
            </div>
          </div>

          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99] glow-subtle'
                : 'border-slate-700/80 hover:border-indigo-500/50 bg-slate-900/40 hover:bg-slate-900/80'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept=".pdf,.txt,.csv,.docx"
              className="hidden"
            />
            {isUploading ? (
              <div className="py-2 flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                <span className="text-xs font-semibold text-slate-200">Chunking & Indexing Vectors...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-200">
                  Drag & drop files or <span className="text-indigo-400 underline">browse</span>
                </p>
                <p className="text-[10px] text-slate-500 font-mono">Automatic 500-token chunking</p>
              </div>
            )}
          </div>
        </div>

        {/* Indexed Documents List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Indexed Documents ({documents.length})
            </span>
            <button
              onClick={handleResetDemo}
              title="Reset Demo Datasets"
              className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors group"
            >
              <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
              Demo Data
            </button>
          </div>

          <div className="space-y-2">
            {documents.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 text-center text-xs text-slate-500">
                No documents indexed yet. Upload a file above or click Demo Data.
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/30 transition-all flex items-center justify-between group glass-card"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                      {getFileIcon(doc.file_type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-slate-200 truncate">{doc.name}</p>
                        {getFileBadge(doc.file_type)}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1">
                        <span className="text-cyan-400 font-bold">{doc.chunk_count} chunks</span>
                        <span>•</span>
                        <span>{(doc.size_bytes / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    title="Remove Document & Vector Index"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-70 group-hover:opacity-100 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer Statistics */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/80">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5">
            <HardDrive className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Total Chunks</p>
              <p className="font-extrabold text-slate-100 font-mono text-sm">{totalChunks}</p>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Active Tools</p>
              <p className="font-extrabold text-slate-100 font-mono text-sm">3 Tools</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
