import React from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import ChatWorkspace from './components/ChatWorkspace';
import ActionCenter from './components/ActionCenter';
import CitationModal from './components/CitationModal';
import EmailModal from './components/EmailModal';
import ReportModal from './components/ReportModal';

function DashboardLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Left Sidebar - Document Manager & Ingestion */}
      <Sidebar />

      {/* Main Chat Workspace */}
      <ChatWorkspace />

      {/* Right Action Center - Live Agent Tasks & Actions */}
      <ActionCenter />

      {/* Modals & Overlays */}
      <CitationModal />
      <EmailModal />
      <ReportModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardLayout />
    </AppProvider>
  );
}
