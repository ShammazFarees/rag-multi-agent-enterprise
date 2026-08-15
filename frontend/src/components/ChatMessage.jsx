import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useApp } from '../context/AppContext';
import { Bot, User, Bookmark, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

export default function ChatMessage({ message }) {
  const { setSelectedCitation } = useApp();
  const isUser = message.sender === 'user';

  return (
    <div className={`flex gap-4 p-5 md:p-6 transition-all ${isUser ? 'bg-slate-950/40' : 'bg-slate-900/60 border-y border-slate-800/40 glass-card'}`}>
      {/* Avatar Icon */}
      <div className="shrink-0">
        {isUser ? (
          <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 shadow-md">
            <User className="w-5 h-5" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Bot className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0 space-y-2.5">
        {/* Header (Sender name + Timestamp + Provider) */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-100 flex items-center gap-1.5">
              {isUser ? 'You' : 'DocuMind Agent'}
              {!isUser && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
            </span>
            {!isUser && message.provider && (
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono font-bold text-indigo-300">
                {message.provider}
              </span>
            )}
          </div>
          <span className="text-slate-500 text-[11px] font-mono">{message.timestamp}</span>
        </div>

        {/* Markdown Rendered Content */}
        <div className="prose prose-invert prose-slate max-w-none text-sm leading-relaxed prose-p:my-2 prose-headings:text-slate-100 prose-headings:font-extrabold prose-headings:my-3 prose-code:text-cyan-300 prose-code:bg-slate-950 prose-code:border prose-code:border-slate-800 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-slate-950/60 prose-blockquote:p-3 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-300 prose-table:border prose-table:border-slate-800 prose-table:rounded-xl prose-th:bg-slate-950 prose-th:text-slate-200 prose-th:p-3 prose-td:p-3 prose-td:border-t prose-td:border-slate-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.text}
          </ReactMarkdown>
        </div>

        {/* Interactive Citation Badges Footer */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="mt-5 pt-3.5 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              Source Grounding Citations (Click to inspect source chunk):
            </div>
            <div className="flex flex-wrap gap-2">
              {message.citations.map((cit, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCitation(cit)}
                  className="group px-3 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono text-cyan-300 flex items-center gap-2 transition-all shadow-sm glow-cyan"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">[{cit.doc_name}: {cit.page_or_section}]</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-[10px] font-extrabold text-cyan-200">
                    {(cit.similarity_score * 100).toFixed(0)}%
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
