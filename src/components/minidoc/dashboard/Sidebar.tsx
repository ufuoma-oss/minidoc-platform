'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, 
  History, 
  Plus, 
  X,
  Search,
  FileText,
  Lock,
  User,
  CreditCard,
  Shield,
  LifeBuoy,
  ChevronRight,
  MoreVertical,
  Trash2,
  Camera,
  LogOut,
  MessageCircle,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tab, ChatSession, Document, SettingModalType } from '@/lib/minidoc/types';
import { ModernAppsIcon, MiniDocLogo3D } from '../icons/CustomIcons';
import { saveDocument } from '@/lib/minidoc/storage';
import { APPS_DATA } from './AppIntegrationModal';

interface SidebarProps {
  activeTab: Tab | 'history';
  setActiveTab: (tab: Tab | 'history') => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  startNewChat: () => void;
  recentChats: ChatSession[];
  onLogout: () => void;
  onDeleteChat: (chatId: string) => void;
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  onDeleteDocument: (docId: string) => void;
  setActiveSettingModal: (modal: SettingModalType) => void;
  loadChat?: (chatId: string) => void;
  connectedAppsCount: number;
  onOpenAppModal: (appId?: string) => void;
  connectedApps: Record<string, boolean>;
  onToggleAppConnection: (appId: string) => void;
  onUploadClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  startNewChat,
  recentChats,
  onLogout,
  onDeleteChat,
  documents,
  setDocuments,
  onDeleteDocument,
  setActiveSettingModal,
  loadChat,
  connectedAppsCount,
  onOpenAppModal,
  connectedApps,
  onToggleAppConnection,
  onUploadClick
}) => {
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isFilesListOpen, setIsFilesListOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const triggerUpload = () => {
    if (onUploadClick) {
      onUploadClick();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      const file = e.target.files[0];
      let type: Document['type'] = 'doc';
      if (file.type.includes('pdf')) type = 'pdf';
      if (file.type.includes('image')) type = 'image';
      
      const newDoc = await saveDocument(file, type);
      setDocuments(prev => [newDoc, ...prev]);
      setIsUploading(false);
      setIsFilesListOpen(true);
    }
  };

  const handleDownload = (doc: Document) => {
    if (doc.content) {
      const link = document.createElement('a');
      link.href = doc.content;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const navItems = [
    { id: 'assistant' as Tab, icon: ModernAppsIcon, label: 'Apps', count: connectedAppsCount },
    { id: 'library' as Tab, icon: Folder, label: 'Library' },
    { id: 'history' as Tab, icon: History, label: 'History' },
  ];

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
      />

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmationId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
            >
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-medium text-black mb-2">Delete Chat?</h3>
              <p className="text-sm text-neutral-500 mb-6">This will permanently delete this conversation.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirmationId(null)} 
                  className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 font-medium rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    onDeleteChat(deleteConfirmationId);
                    setDeleteConfirmationId(null);
                  }} 
                  className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
            >
              <div className="w-12 h-12 bg-neutral-100 text-neutral-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={24} />
              </div>
              <h3 className="text-lg font-medium text-black mb-2">Sign Out?</h3>
              <p className="text-sm text-neutral-500 mb-6">Are you sure you want to sign out?</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLogoutConfirm(false)} 
                  className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 font-medium rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={onLogout} 
                  className="flex-1 py-2.5 bg-black text-white font-medium rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete File Confirmation Modal */}
      <AnimatePresence>
        {docToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
            >
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-medium text-black mb-2">Delete File?</h3>
              <p className="text-sm text-neutral-500 mb-6">This will permanently delete this document.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDocToDelete(null)} 
                  className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 font-medium rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    onDeleteDocument(docToDelete);
                    setDocToDelete(null);
                  }} 
                  className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.div 
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed top-0 left-0 h-full w-[280px] bg-white border-r border-neutral-200 z-50 flex flex-col md:translate-x-0 md:static shadow-xl md:shadow-none`}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex justify-between items-center mb-6">
            <motion.div 
              className="cursor-pointer" 
              onClick={startNewChat}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MiniDocLogo3D size={28} />
            </motion.div>
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="md:hidden p-2 text-neutral-500 hover:text-black rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1 mb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-2.5 rounded-xl transition-all flex items-center justify-center ${
                    activeTab === item.id 
                      ? 'bg-neutral-100 text-black' 
                      : 'text-neutral-500 hover:bg-neutral-50'
                  }`}
                >
                  <Icon size={20} strokeWidth={2} />
                  {item.count && item.count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </motion.button>
              );
            })}
            <motion.button
              onClick={() => setActiveTab('settings')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`ml-auto w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium transition-all ${
                activeTab === 'settings' ? 'ring-2 ring-offset-2 ring-black' : ''
              }`}
            >
              Z
            </motion.button>
          </div>
          
          <div className="h-px bg-neutral-200 w-full"></div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden px-4 pb-4">
          
          {/* APPS TAB */}
          {activeTab === 'assistant' && (
            <div className="flex-1 flex flex-col overflow-hidden pt-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Apps</span>
                <motion.button 
                  onClick={() => onOpenAppModal()} 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-6 h-6 rounded-lg bg-black flex items-center justify-center text-white hover:bg-neutral-800 transition-colors"
                >
                  <Plus size={14} strokeWidth={2.5} />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {connectedAppsCount === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-sm text-neutral-500 mb-4">Connect your apps to get started</p>
                    <motion.button 
                      onClick={() => onOpenAppModal()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors"
                    >
                      Connect Apps
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {APPS_DATA.filter(app => connectedApps[app.id]).map(app => (
                      <motion.div 
                        key={app.id} 
                        onClick={() => onOpenAppModal(app.id)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          {React.cloneElement(app.icon as React.ReactElement<{ size?: number; className?: string }>, { size: 18, className: 'w-5 h-5 object-contain' })}
                          <span className="text-sm font-medium text-black">{app.name}</span>
                        </div>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            onToggleAppConnection(app.id); 
                          }} 
                          className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500 transition-all"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* LIBRARY TAB */}
          {activeTab === 'library' && (
            <div className="flex-1 flex flex-col overflow-hidden pt-2">
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">Library</span>

              <div className="mb-4 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <p className="text-xs text-neutral-500 leading-relaxed mb-2">
                  Add documents for your AI assistant.
                </p>
                <div className="flex gap-1.5 items-start">
                  <Lock size={10} className="text-neutral-400 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-neutral-400 font-medium leading-relaxed">
                    Files are private and secure.
                  </p>
                </div>
              </div>
              
              <motion.button 
                onClick={triggerUpload}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white rounded-xl transition-colors flex items-center justify-center gap-2 mb-4"
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Upload size={16} strokeWidth={2.5} />
                    <span className="text-sm font-medium">Upload Files</span>
                  </>
                )}
              </motion.button>
              
              <div 
                onClick={() => setIsFilesListOpen(!isFilesListOpen)}
                className="flex items-center justify-between py-2 cursor-pointer group hover:bg-neutral-50 rounded-lg transition-colors px-1"
              >
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Recent Files</span>
                <ChevronRight size={14} className={`text-neutral-400 transition-transform duration-200 ${isFilesListOpen ? 'rotate-90' : ''}`} />
              </div>

              {isFilesListOpen && (
                <div className="flex-1 overflow-y-auto">
                  {documents.length > 0 ? documents.map((doc) => (
                    <div key={doc.id} className="group flex items-center justify-between p-2 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer mb-1">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          doc.type === 'pdf' ? 'bg-red-50 text-red-600' : 
                          doc.type === 'image' ? 'bg-purple-50 text-purple-600' : 
                          'bg-neutral-100 text-neutral-500'
                        }`}>
                          {doc.type === 'pdf' ? <FileText size={16} /> : doc.type === 'image' ? <Camera size={16} /> : <FileText size={16} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-black truncate max-w-[140px]">{doc.name}</p>
                          <p className="text-xs text-neutral-400">{doc.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDownload(doc); }} 
                          className="p-1.5 text-neutral-400 hover:text-black rounded-md hover:bg-neutral-100"
                        >
                          <MoreVertical size={14} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setDocToDelete(doc.id); }} 
                          className="p-1.5 text-neutral-400 hover:text-red-500 rounded-md hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-neutral-400 px-2 py-4 text-center">No files yet.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="flex-1 flex flex-col overflow-hidden pt-2">
              <motion.button 
                onClick={startNewChat} 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-2.5 bg-black text-white font-medium rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span className="text-sm">New Chat</span>
              </motion.button>

              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search history..." 
                  value={chatSearchQuery} 
                  onChange={(e) => setChatSearchQuery(e.target.value)} 
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-neutral-300 transition-colors" 
                />
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-1">
                {recentChats.filter(chat => chat.title.toLowerCase().includes(chatSearchQuery.toLowerCase())).map((chat) => (
                  <motion.div 
                    key={chat.id} 
                    onClick={() => loadChat?.(chat.id)} 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="relative w-full text-left px-3 py-3 rounded-xl text-sm hover:bg-neutral-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-black truncate pr-8">{chat.title}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmationId(chat.id); }} 
                        className="absolute right-2 top-2 p-1 text-neutral-400 hover:text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">{chat.date}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="flex-1 flex flex-col overflow-hidden pt-2">
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">Settings</span>
              
              <div className="flex-1 overflow-y-auto space-y-1">
                <motion.button 
                  onClick={() => setActiveSettingModal('account')} 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">Account</p>
                    <p className="text-xs text-neutral-400">Name and email</p>
                  </div>
                </motion.button>
                
                <motion.button 
                  onClick={() => setActiveSettingModal('billing')} 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">Billing & Plan</p>
                    <p className="text-xs text-neutral-400">Manage subscription</p>
                  </div>
                </motion.button>

                <motion.button 
                  onClick={() => setActiveSettingModal('privacy')} 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center">
                    <Shield size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">Privacy & Security</p>
                    <p className="text-xs text-neutral-400">Password, data controls</p>
                  </div>
                </motion.button>

                <motion.button 
                  onClick={() => setActiveSettingModal('messaging')} 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">Messaging Apps</p>
                    <p className="text-xs text-neutral-400">Telegram, WhatsApp</p>
                  </div>
                </motion.button>

                <motion.button 
                  onClick={() => setActiveSettingModal('support')} 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-600 flex items-center justify-center">
                    <LifeBuoy size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">Help & Support</p>
                    <p className="text-xs text-neutral-400">Guides, FAQs, contact</p>
                  </div>
                </motion.button>
              </div>

              <div className="pt-3 border-t border-neutral-200 mt-3">
                <motion.button 
                  onClick={() => setShowLogoutConfirm(true)} 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-left transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-400 group-hover:bg-red-100 group-hover:text-red-500 flex items-center justify-center transition-colors">
                    <LogOut size={16} />
                  </div>
                  <span className="text-sm font-medium text-neutral-500 group-hover:text-red-600 transition-colors">Sign Out</span>
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
