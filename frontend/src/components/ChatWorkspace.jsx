import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ChatMessage from './ChatMessage';
import { 
  Send, 
  Sparkles, 
  Bot, 
  PanelRightOpen, 
  PanelRightClose, 
  FileText, 
  Mail, 
  CheckSquare, 
  HelpCircle,
  Loader2
} from 'lucide-react';

export default function ChatWorkspace() {
  const { 
    messages, 
    isProcessing, 
    handleSendMessage, 
    isActionCenterOpen, 
    setIsActionCenterOpen 
  } = useApp();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      handleSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const samplePrompts = [
    {
      label: '📊 Q3 Financial Findings',
      prompt: 'Summarize Q3 financial revenue, gross margins, and cloud expenditure recommendations from audit report.'
    },
    {
      label: '🛡️ Password & MFA Policy',
      prompt: 'What are our enterprise security standards regarding passwords and MFA authentication?'
    },
    {
      label: '✉️ Draft Email to CFO',
      prompt: 'Summarize financial audit item 3.1 and draft an executive email to cfo@documind.ai'
    },
    {
      label: '📌 Create Task Item',
      prompt: 'Create a high priority task to renegotiate GPU vector cloud infrastructure contracts by Q4.'
    }
  ];

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 bg-slate-950">
      {/* Top Header Bar */}
      <header className="h-14 px-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 glass-panel">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Enterprise Agent Workspace
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-300 font-mono">
                RAG Active
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Action Center Toggle */}
          <button
            onClick={() => setIsActionCenterOpen(!isActionCenterOpen)}
            className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
              isActionCenterOpen
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            {isActionCenterOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            <span>Action Center</span>
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto divide-y divide-slate-800/50">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isProcessing && (
            <div className="p-6 bg-slate-900/80 border-y border-slate-800/50 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-3 text-sm text-cyan-400 font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Retrieving vectors & synthesizing grounded response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area + Sample Prompt Pills */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/80 glass-panel">
        <div className="max-w-4xl mx-auto space-y-3">
          
          {/* Quick Prompts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-semibold uppercase text-slate-500 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Quick:
            </span>
            {samplePrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.prompt)}
                disabled={isProcessing}
                className="px-3 py-1 rounded-full bg-slate-800/60 hover:bg-indigo-600/20 border border-slate-700/60 hover:border-indigo-500/40 text-xs font-medium text-slate-300 hover:text-indigo-300 shrink-0 transition-all disabled:opacity-50"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Text Input Box */}
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question grounded on documents or instruct agent tools..."
              disabled={isProcessing}
              className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
            />

            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="absolute right-2 p-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
