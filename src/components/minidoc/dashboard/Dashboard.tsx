'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatView from './ChatView';
import PaywallModal from './PaywallModal';
import SettingsModal from './SettingsModal';
import AppIntegrationModal, { APPS_DATA } from './AppIntegrationModal';
import OnboardingModal from './OnboardingModal';
import FileUpload from './FileUpload';
import { Tab, Message, Document, ChatSession, SettingModalType } from '@/lib/minidoc/types';
import { getChats, createChat, getMessages, saveMessage, clearSession, deleteChat, hasCompletedOnboarding, completeOnboarding } from '@/lib/minidoc/storage';
import { getDocuments as getApiDocuments, deleteDocument as deleteApiDocument } from '@/lib/api';

interface DashboardProps {
  onSignOut: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState<Tab | 'history'>('history');
  
  // Chat State
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Data State
  const [documents, setDocuments] = useState<Document[]>([]);
  const [recentChats, setRecentChats] = useState<ChatSession[]>([]);
  
  // Attached Documents for current chat
  const [attachedDocIds, setAttachedDocIds] = useState<string[]>([]);
  
  // Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // File Upload State
  const [showFileUpload, setShowFileUpload] = useState(false);
  
  // App Integration State
  const [connectedApps, setConnectedApps] = useState<Record<string, boolean>>({
    gmail: true,
    drive: false,
    outlook: false,
    sheets: false,
    whatsapp: false,
    linkedin: false,
    calendar: false,
    slack: false,
    teams: false,
    m365: false
  });

  // Payment / Access State
  const [hasPaid, setHasPaid] = useState(true); // Enabled for demo
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  
  // Settings Modal State
  const [activeSettingModal, setActiveSettingModal] = useState<SettingModalType>(null);
  
  // App Integration Modal State
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [initialAppModalId, setInitialAppModalId] = useState<string | null>(null);

  // API URL for Python backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://minidoc-api.onrender.com';

  // Load Data on Mount
  useEffect(() => {
    // Load chats from localStorage
    setRecentChats(getChats());
    
    // Fetch documents from Python backend
    fetchDocuments();
    
    // Check if user needs onboarding
    if (!hasCompletedOnboarding()) {
      setShowOnboarding(true);
    }
  }, []);
  
  const fetchDocuments = async () => {
    try {
      const result = await getApiDocuments('demo-user');
      const apiDocs = result.documents.map((doc: any) => ({
        id: doc.id,
        name: doc.filename || doc.original_name,
        type: doc.mime_type?.includes('pdf') ? 'pdf' : 
              doc.mime_type?.includes('image') ? 'image' : 'doc',
        size: `${(doc.size / 1024).toFixed(1)} KB`,
        status: doc.status || 'ready',
        date: doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Today',
        content: doc.url,
        mimeType: doc.mime_type,
        extractedText: doc.extracted_text
      }));
      setDocuments(apiDocs);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };
  
  const handleOnboardingComplete = () => {
    completeOnboarding();
    setShowOnboarding(false);
  };

  const checkAccess = () => {
    if (!hasPaid) {
      setShowPaywall(true);
      return false;
    }
    return true;
  };

  const handleOpenAppModal = (appId?: string) => {
    setInitialAppModalId(appId || null);
    setIsAppModalOpen(true);
  };

  const handleToggleAppConnection = (appId: string) => {
    setConnectedApps(prev => ({
      ...prev,
      [appId]: !prev[appId]
    }));
  };

  // Toggle document attachment
  const toggleDocAttachment = (docId: string) => {
    setAttachedDocIds(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  // Get attached documents
  const attachedDocs = documents.filter(d => attachedDocIds.includes(d.id));

  const handleFileUploadComplete = async (uploadedFiles: any[]) => {
    // Refresh documents from API after upload
    await fetchDocuments();
    
    // Auto-attach newly uploaded documents
    const newDocIds = uploadedFiles.map(f => f.id);
    setAttachedDocIds(prev => [...prev, ...newDocIds]);
    
    setShowFileUpload(false);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date(),
      attachedDocs: attachedDocIds.length > 0 ? attachedDocIds : undefined
    };

    let chatId = currentChatId;
    if (!chatId) {
      const newChat = createChat(inputText.slice(0, 30) + '...');
      chatId = newChat.id;
      setCurrentChatId(chatId);
      setRecentChats(getChats());
    }

    setMessages(prev => [...prev, newMessage]);
    saveMessage(chatId, newMessage);
    setInputText('');
    setIsTyping(true);

    try {
      // Get attached documents with their content
      const docsForChat = attachedDocs.map(d => ({
        id: d.id,
        filename: d.name,
        mimeType: d.mimeType,
        extractedText: d.extractedText || ''
      }));

      // Call the Python backend on Render
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: newMessage.text, 
          documents: docsForChat,
          session_id: chatId
        })
      });
      
      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.response || "I processed your request. How can I help you further?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      saveMessage(chatId, aiMessage);
    } catch (e) {
      console.error('Chat error:', e);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text: "I encountered an error connecting to the AI. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setAttachedDocIds([]); // Clear attached docs for new chat
    setActiveTab('history');
  };

  const loadChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setMessages(getMessages(chatId));
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    clearSession();
    onSignOut();
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteApiDocument(id, 'demo-user');
      await fetchDocuments();
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
    // Remove from attached if deleted
    setAttachedDocIds(prev => prev.filter(docId => docId !== id));
  };

  const connectedAppsCount = Object.values(connectedApps).filter(Boolean).length;

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-white">
      {/* File Upload Modal */}
      {showFileUpload && (
        <FileUpload 
          onUploadComplete={handleFileUploadComplete}
          onClose={() => setShowFileUpload(false)}
        />
      )}
      
      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal 
          onClose={() => setShowPaywall(false)}
          onPayment={() => {
            setIsPaymentLoading(true);
            setTimeout(() => {
              setIsPaymentLoading(false);
              setHasPaid(true);
              setShowPaywall(false);
            }, 1500);
          }}
          onSkipToBilling={() => {
            setShowPaywall(false);
            setActiveSettingModal('billing');
          }}
          isLoading={isPaymentLoading}
        />
      )}

      {/* App Integration Modal */}
      <AppIntegrationModal 
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        connectedApps={connectedApps}
        onToggleConnection={handleToggleAppConnection}
        initialAppId={initialAppModalId}
      />

      {/* Settings Modal */}
      <SettingsModal 
        type={activeSettingModal}
        onClose={() => setActiveSettingModal(null)}
        onLogout={handleLogout}
      />
      
      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
      
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        startNewChat={startNewChat}
        recentChats={recentChats}
        onLogout={handleLogout}
        onDeleteChat={(id) => {
          deleteChat(id);
          setRecentChats(getChats());
        }}
        documents={documents}
        setDocuments={setDocuments}
        onDeleteDocument={handleDeleteDocument}
        setActiveSettingModal={setActiveSettingModal}
        loadChat={loadChat}
        connectedAppsCount={connectedAppsCount}
        onOpenAppModal={handleOpenAppModal}
        connectedApps={connectedApps}
        onToggleAppConnection={handleToggleAppConnection}
        onUploadClick={() => setShowFileUpload(true)}
      />
      
      {/* Main Chat View */}
      <main className="flex-1 h-full min-w-0">
        <ChatView 
          messages={messages}
          inputText={inputText}
          setInputText={setInputText}
          handleSend={handleSend}
          isTyping={isTyping}
          toggleSidebar={() => {
            setActiveTab('history');
            setIsSidebarOpen(true);
          }}
          hasPaid={hasPaid}
          startNewChat={startNewChat}
          onConnectApp={handleOpenAppModal}
          onFileUpload={() => setShowFileUpload(true)}
          documents={documents}
          attachedDocIds={attachedDocIds}
          onToggleDocAttachment={toggleDocAttachment}
        />
      </main>
    </div>
  );
};

export default Dashboard;
