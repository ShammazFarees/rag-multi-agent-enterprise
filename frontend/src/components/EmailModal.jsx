import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Copy, Check, Send, CheckCircle2 } from 'lucide-react';

export default function EmailModal() {
  const { selectedEmail, setSelectedEmail } = useApp();
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  if (!selectedEmail) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`To: ${selectedEmail.recipient}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSelectedEmail(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden glass-panel">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-indigo-950/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Agent Email Summary Draft
              </h3>
              <p className="text-xs text-indigo-300 font-mono">
                Ready for export or dispatch
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedEmail(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs">
          {sent ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="text-base font-bold text-slate-100">Email Dispatched Successfully!</h4>
              <p className="text-xs text-slate-400">Sent summary to {selectedEmail.recipient}</p>
            </div>
          ) : (
            <>
              {/* Recipient */}
              <div className="space-y-1">
                <span className="font-semibold text-slate-400 uppercase text-[10px]">Recipient:</span>
                <input
                  type="text"
                  readOnly
                  value={selectedEmail.recipient}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-slate-200"
                />
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <span className="font-semibold text-slate-400 uppercase text-[10px]">Subject:</span>
                <input
                  type="text"
                  readOnly
                  value={selectedEmail.subject}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-slate-100"
                />
              </div>

              {/* Email Body */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-semibold text-slate-400 uppercase text-[10px]">
                  <span>Body Text:</span>
                  <button
                    onClick={handleCopy}
                    className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 font-sans"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied to Clipboard' : 'Copy Email Content'}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={selectedEmail.body}
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-sans text-slate-300 leading-relaxed outline-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!sent && (
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy All'}</span>
            </button>

            <button
              onClick={handleSend}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-xs font-bold text-white transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Email</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
