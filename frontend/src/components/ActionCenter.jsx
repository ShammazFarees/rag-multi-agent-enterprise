import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Mail, 
  FileText, 
  Clock, 
  User, 
  Zap,
  Sparkles,
  Calendar
} from 'lucide-react';

export default function ActionCenter() {
  const { 
    tasks, 
    handleToggleTask, 
    handleDeleteTask, 
    handleManualCreateTask,
    setSelectedEmail,
    setSelectedReport,
    isActionCenterOpen
  } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');
  const [assignee, setAssignee] = useState('');

  if (!isActionCenterOpen) return null;

  const handleSubmitNewTask = (e) => {
    e.preventDefault();
    if (title.trim()) {
      handleManualCreateTask(title, priority, deadline || 'TBD', assignee || 'Unassigned');
      setTitle('');
      setPriority('Medium');
      setDeadline('');
      setAssignee('');
      setShowAddForm(false);
    }
  };

  const getPriorityBadge = (p) => {
    if (p === 'High') return <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-[10px] font-bold text-red-400 font-mono">High</span>;
    if (p === 'Low') return <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 font-mono">Low</span>;
    return <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-400 font-mono">Med</span>;
  };

  return (
    <aside className="w-80 h-full bg-slate-950/90 border-l border-slate-800/80 flex flex-col shrink-0 select-none glass-panel">
      
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <h2 className="font-extrabold text-sm text-slate-100 uppercase tracking-wide">Action Center</h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono font-bold text-indigo-300">
          {tasks.filter(t => !t.completed).length} Pending
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Quick Agent Actions (Email & Report) */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Agent Output Tools
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedEmail({
                recipient: "hr@company.com",
                subject: "Executive Analysis & Findings Summary",
                body: "Based on DocuMind RAG analysis of active documents, key findings have been compiled for review."
              })}
              className="p-3.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 hover:border-indigo-400 text-left transition-all group glass-card"
            >
              <Mail className="w-4 h-4 text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-slate-200">Email Drafts</p>
              <p className="text-[10px] text-indigo-300 font-mono mt-0.5">Format & Send</p>
            </button>

            <button
              onClick={() => setSelectedReport({
                title: "DocuMind Executive Summary Report",
                summary: "Aggregated intelligence synthesized from active RAG document indices.",
                sections: [
                  { heading: "Document Intelligence", content: "Key data points extracted and grounded with high similarity confidence." },
                  { heading: "Compliance & Security", content: "MFA standards and zero-data retention policies active." }
                ],
                timestamp: new Date().toLocaleDateString()
              })}
              className="p-3.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all group glass-card"
            >
              <FileText className="w-4 h-4 text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-slate-200">Export Report</p>
              <p className="text-[10px] text-cyan-300 font-mono mt-0.5">Generate Summary</p>
            </button>
          </div>
        </div>

        {/* Autonomous Tasks Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
              Agent & Manual Tasks ({tasks.length})
            </span>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all shadow-sm"
              title="Add Task Manually"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Task Form Toggle */}
          {showAddForm && (
            <form onSubmit={handleSubmitNewTask} className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 space-y-2.5 text-xs glass-card">
              <input
                type="text"
                placeholder="Task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 outline-none focus:border-indigo-500"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-300"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-300"
                />
              </div>
              <input
                type="text"
                placeholder="Assignee (e.g. CFO, SecOps)"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-300"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Task
                </button>
              </div>
            </form>
          )}

          {/* Tasks List */}
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 text-center text-xs text-slate-500">
                No tasks created yet. Ask the agent to create a task!
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition-all ${
                    task.completed
                      ? 'bg-slate-950/40 border-slate-800/80 opacity-60'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-indigo-500/40 glass-card'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-0.5 text-indigo-400 hover:text-indigo-300 shrink-0"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold leading-snug ${task.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {task.title}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-mono flex-wrap">
                        {getPriorityBadge(task.priority)}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {task.deadline}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-500" />
                          {task.assignee}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
