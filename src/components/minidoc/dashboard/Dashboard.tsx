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
import { getDocuments, getChats, createChat, getMessages, saveMessage, clearSession, deleteDocument, deleteChat, hasCompletedOnboarding, completeOnboarding } from '@/lib/minidoc/storage';

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

  // Load Data on Mount
  useEffect(() => {
    setDocuments(getDocuments());
    setRecentChats(getChats());
    
    // Check if user needs onboarding
    if (!hasCompletedOnboarding()) {
      setShowOnboarding(true);
    }
  }, []);
  
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

  const handleFileUploadComplete = (uploadedFiles: any[]) => {
    // Add uploaded files to documents
    const newDocs: Document[] = uploadedFiles.map(f => ({
      id: f.id,
      name: f.name,
      type: f.type,
      size: f.size,
      uploadedAt: new Date(),
      status: 'ready' as const
    }));
    
    setDocuments(prev => [...prev, ...newDocs]);
    setShowFileUpload(false);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
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
      // Prepare document context for the AI
      const docContext = documents.map(d => ({
        id: d.id,
        filename: d.name,
        mimeType: d.type,
        extractedText: d.extractedText || ''
      }));

      // Call the API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: newMessage.text, 
          documents: docContext,
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

  const handleDeleteDocument = (id: string) => {
    deleteDocument(id);
    setDocuments(getDocuments());
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
        />
      </main>
    </div>
  );
};

export default Dashboard;
