'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Search, ArrowLeft, Check, ChevronRight, Shield, Zap, Globe } from 'lucide-react';
import { GmailLogo } from '../icons/CustomIcons';
import { AppDefinition } from '@/lib/minidoc/types';

// App Definition Interface already in types

interface AppIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedApps: Record<string, boolean>;
  onToggleConnection: (appId: string) => void;
  initialAppId?: string | null;
}

// Unified App Data
export const APPS_DATA: AppDefinition[] = [
  { 
    id: 'gmail', name: 'Gmail', 
    icon: <GmailLogo size={40} />, 
    description: "Full Gmail management. Including delete, draft, summarize, read emails, send, reply. All from the chat interface here.",
    permissions: ["Read your emails", "Send emails on your behalf", "Manage drafts", "Delete emails"],
    category: 'communication'
  },
  { 
    id: 'drive', name: 'Google Drive', 
    icon: <img src="https://res.cloudinary.com/dfbh21zqc/image/upload/v1767457510/new-logo-drive-google_lzbhbn.svg" alt="Drive" className="w-10 h-10 object-contain" />, 
    description: "Full Drive management. Search, read, upload, and organize your files directly from the chat.",
    permissions: ["View and download files", "Search file metadata", "Upload generated documents"],
    category: 'storage'
  },
  { 
    id: 'outlook', name: 'Outlook', 
    icon: <img src="https://res.cloudinary.com/dfbh21zqc/image/upload/v1767457512/outlook-icon_sj6di5.svg" alt="Outlook" className="w-10 h-10 object-contain" />, 
    description: "Sync your calendar and emails to stay on top of your schedule seamlessly.",
    permissions: ["Read and write emails", "Manage calendar events", "Sync contacts"],
    category: 'communication'
  },
  { 
    id: 'calendar', name: 'Google Calendar', 
    icon: <img src="https://res.cloudinary.com/dfbh21zqc/image/upload/v1767542094/google-calendar-icon-2020-_h3xvup.svg" alt="Calendar" className="w-10 h-10 object-contain" />, 
    description: "Manage your schedule, set reminders, and never miss a date.",
    permissions: ["View your calendars", "Create and edit events", "Send invites"],
    category: 'productivity'
  },
  { 
    id: 'slack', name: 'Slack', 
    icon: <img src="https://res.cloudinary.com/dfbh21zqc/image/upload/slack-new-logo_xth7ei.svg" alt="Slack" className="w-10 h-10 object-contain" />, 
    description: "Sync channels and direct messages to summarize discussions and automate updates.",
    permissions: ["View content in channels", "Send messages", "View user profile"],
    category: 'communication'
  },
  { 
    id: 'teams', name: 'Microsoft Teams', 
    icon: <img src="https://res.cloudinary.com/dfbh21zqc/image/upload/microsoft-teams-1_spqfkh.svg" alt="Teams" className="w-10 h-10 object-contain" />, 
    description: "Collaborate seamlessly by integrating chats, meetings, and files from Teams.",
    permissions: ["Read chat messages", "Join meetings", "Access shared files"],
    category: 'communication'
  },
  { 
    id: 'sheets', name: 'Google Sheets', 
    icon: <img src="https://res.cloudinary.com/dfbh21zqc/image/upload/v1767457511/google-sheets-logo-icon_eigzif.svg" alt="Sheets" className="w-10 h-10 object-contain" />, 
    description: "Analyze spreadsheets, create reports, and visualize your data instantly.",
    permissions: ["View and edit spreadsheets", "Create new sheets"],
    category: 'productivity'
  },
  { 
    id: 'm365', name: 'Microsoft 365', 
    icon: <img src="https://res.cloudinary.com/dfbh21zqc/image/upload/Microsoft-365_bl0zcn.svg" alt="M365" className="w-10 h-10 object-contain" />, 
    description: "Connect Word, Excel, and PowerPoint to search and edit your documents with AI.",
    permissions: ["Read user files", "Edit documents", "Search across 365"],
    category: 'productivity'
  },
  { 
    id: 'whatsapp', name: 'WhatsApp', 
    icon: <img src="https://res.cloudinary.com/dfbh21zqc/image/upload/v1767542092/whatsapp_174879_fuq3bw.png" alt="WhatsApp" className="w-10 h-10 object-contain" />, 
    description: "Send messages and manage conversations directly from the chat.",
    permissions: ["Send messages", "Read message history"],
    category: 'social'
  },
  { 
    id: 'linkedin', name: 'LinkedIn', 
    icon: <img src="https://res.cloudinary.com/dfbh21zqc/image/upload/v1767457510/linkedin-icon-2_zkw9p5.svg" alt="LinkedIn" className="w-10 h-10 object-contain" />, 
    description: "Optimize your profile, draft posts, and manage professional connections.",
    permissions: ["View profile", "Post updates", "Manage connections"],
    category: 'social'
  }
];

const AppIntegrationModal: React.FC<AppIntegrationModalProps> = ({ 
  isOpen, 
  onClose, 
  connectedApps, 
  onToggleConnection,
  initialAppId 
}) => {
  type ViewType = 'list' | 'detail' | 'request' | 'request-success';
  
  // Compute initial app and view based on props
  const initialApp = useMemo(() => {
    if (initialAppId) {
      return APPS_DATA.find(a => a.id === initialAppId) || null;
    }
    return null;
  }, [initialAppId]);
  
  const [view, setView] = useState<ViewType>(initialApp ? 'detail' : 'list');
  const [selectedApp, setSelectedApp] = useState<AppDefinition | null>(initialApp);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  const [requestName, setRequestName] = useState('');
  const [requestDesc, setRequestDesc] = useState('');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle initialApp changes when modal is open
  useEffect(() => {
    if (isOpen) {
      if (initialApp) {
        // Use timeout to defer state update
        const timer = setTimeout(() => {
          setSelectedApp(initialApp);
          setView('detail');
        }, 0);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setView('list');
          searchInputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, initialApp]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setView('list');
        setSelectedApp(null);
        setSearchQuery('');
        setRequestName('');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleAppClick = (app: AppDefinition) => {
    setSelectedApp(app);
    setView('detail');
  };

  const handleConnect = () => {
    if (!selectedApp) return;
    setIsConnecting(true);
    setTimeout(() => {
      onToggleConnection(selectedApp.id);
      setIsConnecting(false);
    }, 1500);
  };

  const handleDisconnect = () => {
    if (!selectedApp) return;
    onToggleConnection(selectedApp.id);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setView('request-success');
    }, 1200);
  };

  if (!isOpen) return null;

  const filteredApps = APPS_DATA.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div 
        className="bg-[#EAE9E5] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] border border-white/40 relative animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200/50 flex items-center justify-between bg-[#EAE9E5] shrink-0 h-[72px]">
          <div className="flex items-center gap-3">
            {view !== 'list' && (
              <button 
                onClick={() => {
                  if(view === 'request-success') {
                    setView('list');
                    setRequestName('');
                  } else {
                    setView('list');
                  }
                }} 
                className="p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/5 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-900 font-serif">
              {view === 'list' && 'Connect apps'}
              {view === 'detail' && selectedApp?.name}
              {(view === 'request' || view === 'request-success') && 'Request App'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-black/5 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto min-h-[400px] bg-[#F8F7F4]">
          
          {/* LIST VIEW */}
          {view === 'list' && (
            <div className="p-6">
              
              <div className="flex items-center justify-end mb-3">
                <button 
                  onClick={() => setView('request')}
                  className="px-3 py-1.5 bg-white border border-gray-200 hover:border-[#FF5A36] text-[10px] font-bold text-gray-500 hover:text-[#FF5A36] rounded-full transition-all shadow-sm font-sans"
                >
                  Request App
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Search apps (e.g. Gmail, Slack)..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
                />
              </div>

              {/* App Grid */}
              {filteredApps.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredApps.map(app => {
                    const isConnected = connectedApps[app.id];
                    return (
                      <div 
                        key={app.id} 
                        onClick={() => handleAppClick(app)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer group flex items-start gap-4 ${
                          isConnected 
                          ? 'bg-white border-green-200 shadow-sm' 
                          : 'bg-white border-gray-200 hover:border-[#FF5A36]/50 hover:shadow-md'
                        }`}
                      >
                        <div className="w-12 h-12 flex items-center justify-center shrink-0 bg-gray-50 rounded-lg border border-gray-100 group-hover:scale-105 transition-transform">
                          {React.cloneElement(app.icon as React.ReactElement<{ className?: string }>, { className: 'w-7 h-7 object-contain' })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-gray-900 font-sans">{app.name}</h3>
                            {isConnected && <Check size={14} className="text-green-600" strokeWidth={3} />}
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-serif">
                            {app.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium mb-6 font-serif">No apps found for "{searchQuery}"</p>
                  <button 
                    onClick={() => { setRequestName(searchQuery); setView('request'); }}
                    className="px-6 py-2.5 bg-white border border-gray-200 text-[#FF5A36] font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-sm"
                  >
                    Request "{searchQuery}"
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DETAIL VIEW */}
          {view === 'detail' && selectedApp && (
            <div className="p-6 md:p-8 flex flex-col h-full">
              
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center mb-4 p-3">
                  {React.cloneElement(selectedApp.icon as React.ReactElement<{ className?: string }>, { className: 'w-full h-full object-contain' })}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Connect {selectedApp.name}</h1>
                <p className="text-gray-600 max-w-sm mx-auto font-serif text-sm leading-relaxed">
                  {selectedApp.description}
                </p>
              </div>

              {/* Connect Button */}
              <div className="mb-8 w-full max-w-sm mx-auto">
                {connectedApps[selectedApp.id] ? (
                  <div className="flex flex-col gap-3">
                    <div className="w-full py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 font-bold flex items-center justify-center gap-2">
                      <Check size={20} /> Connected
                    </div>
                    <button 
                      onClick={handleDisconnect}
                      className="w-full py-2.5 text-sm text-gray-400 hover:text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
                    >
                      Disconnect App
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-base"
                  >
                    {isConnecting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Zap size={18} fill="currentColor" />
                        Connect {selectedApp.name}
                      </>
                    )}
                  </button>
                )}
                <p className="text-[10px] text-center text-gray-400 mt-3 font-sans">
                  By connecting, you agree to Mini Doc&apos;s Privacy Policy. Data is encrypted end-to-end.
                </p>
              </div>

              {/* Permissions */}
              <div className="mt-auto bg-gray-50/50 rounded-xl border border-gray-200/60 p-5 shadow-sm">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 font-sans flex items-center gap-2">
                  <Shield size={12} /> Permissions Requested
                </h4>
                <ul className="space-y-2.5">
                  {selectedApp.permissions.map((perm, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                      <div className="mt-0.5 p-0.5 bg-gray-200 text-gray-500 rounded-full">
                        <Check size={8} strokeWidth={4} />
                      </div>
                      <span className="font-medium font-serif leading-tight">{perm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* REQUEST VIEW */}
          {view === 'request' && (
            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif">What app should we build next?</h3>
                <p className="text-gray-600 text-sm font-serif">We build integrations based on user demand. Tell us what you need.</p>
              </div>
              
              <form onSubmit={handleRequestSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">App Name</label>
                  <input 
                    type="text" 
                    value={requestName}
                    onChange={e => setRequestName(e.target.value)}
                    placeholder="e.g. Notion, Trello..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Website (Optional)</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="url" 
                      placeholder="https://..."
                      className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">How would you use it?</label>
                  <textarea 
                    value={requestDesc}
                    onChange={e => setRequestDesc(e.target.value)}
                    placeholder="I want to sync my tasks..."
                    rows={4}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all resize-none font-serif"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isConnecting}
                  className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {isConnecting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* SUCCESS VIEW */}
          {view === 'request-success' && (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
                <Check size={32} strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Request Sent!</h3>
              <p className="text-gray-600 max-w-xs mx-auto mb-8 font-serif">
                Thanks for your feedback. We&apos;ll notify you when <strong>{requestName}</strong> is available.
              </p>
              <button 
                onClick={() => setView('list')}
                className="px-8 py-3 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 font-bold rounded-xl transition-all shadow-sm"
              >
                Back to Apps
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AppIntegrationModal;
