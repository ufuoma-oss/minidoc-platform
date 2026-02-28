'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ArrowUp, SquarePen, Menu, Globe, Plus, Paperclip, FileText, X } from 'lucide-react';
import { VoiceWave } from '../icons/CustomIcons';
import { Message, Document } from '@/lib/minidoc/types';
import { APPS_DATA } from './AppIntegrationModal';
import { motion, AnimatePresence } from 'motion/react';

interface ChatViewProps {
  messages: Message[];
  inputText: string;
  setInputText: (text: string) => void;
  handleSend: () => void;
  isTyping: boolean;
  toggleSidebar: () => void;
  hasPaid: boolean;
  startNewChat: () => void;
  onConnectApp: (appId?: string) => void;
  onFileUpload: () => void;
  documents: Document[];
}

const PLACEHOLDERS = [
  "Scan my emails for what needs my immediate attention...",
  "Compile all last month's receipts into a spreadsheet...",
  "Create this week's plan and add all tasks to my to-do list...",
  "Make a PDF with all letters from my lawyer...",
  "Reply to landlord via WhatsApp...",
  "Update budget with recent expenses..."
];

const ChatView: React.FC<ChatViewProps> = ({
  messages,
  inputText,
  setInputText,
  handleSend,
  isTyping,
  toggleSidebar,
  hasPaid,
  startNewChat,
  onConnectApp,
  onFileUpload,
  documents
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const welcomeInputRef = useRef<HTMLTextAreaElement>(null);
  
  const [placeholderText, setPlaceholderText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [attachedDocs, setAttachedDocs] = useState<Document[]>([]);

  useEffect(() => {
    if (messages.length > 0) return;

    const currentPhrase = PLACEHOLDERS[phraseIndex];
    let timer: ReturnType<typeof setTimeout>;
    const typingSpeed = isDeleting ? 15 : 25;
    const pauseDuration = 2500;

    if (!isDeleting && placeholderText === currentPhrase) {
      timer = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && placeholderText === '') {
      timer = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
      }, 0);
    } else {
      timer = setTimeout(() => {
        setPlaceholderText(currentPhrase.substring(0, placeholderText.length + (isDeleting ? -1 : 1)));
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, phraseIndex, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
    if (welcomeInputRef.current) {
      welcomeInputRef.current.style.height = 'auto';
      welcomeInputRef.current.style.height = `${Math.min(welcomeInputRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText, placeholderText]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleDoc = (doc: Document) => {
    setAttachedDocs(prev => 
      prev.find(d => d.id === doc.id)
        ? prev.filter(d => d.id !== doc.id)
        : [...prev, doc]
    );
  };

  const isChatEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tiny Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 bg-white">
        <div className="flex items-center gap-3">
          <motion.button 
            onClick={toggleSidebar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-1.5 text-neutral-600 hover:text-black rounded-lg hover:bg-neutral-100"
          >
            <Menu size={18} />
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          {!isChatEmpty && (
            <motion.button 
              onClick={startNewChat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 text-neutral-600 hover:text-black rounded-lg hover:bg-neutral-100" 
            >
              <SquarePen size={16} />
            </motion.button>
          )}
        </div>
      </header>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto scrollbar-hide flex flex-col ${isChatEmpty ? 'items-center justify-center' : ''}`}>
        
        {isChatEmpty ? (
          <div className="w-full max-w-3xl px-4 md:px-6 pb-48 pt-8 flex flex-col items-center">
            
            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-medium text-black mb-2">
                Let&apos;s spark some brilliance,
              </h1>
              <h1 className="text-3xl md:text-4xl font-medium text-black">
                John.
              </h1>
            </motion.div>

            {/* Document Attachments Preview */}
            {documents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full mb-6"
              >
                <p className="text-sm text-neutral-500 mb-2">Your documents:</p>
                <div className="flex flex-wrap gap-2">
                  {documents.slice(0, 5).map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => toggleDoc(doc)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        attachedDocs.find(d => d.id === doc.id)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-black'
                      }`}
                    >
                      <FileText size={14} />
                      {doc.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* App Cards */}
            <div className="w-full overflow-hidden mb-8">
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {APPS_DATA.slice(0, 6).map((app, index) => (
                  <motion.button
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    onClick={() => onConnectApp(app.id)} 
                    className="flex-shrink-0 w-52 p-4 bg-white rounded-2xl text-left border border-neutral-200 hover:border-black/20 snap-center group"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-black">{app.name}</h3>
                      <div className="p-1.5 bg-neutral-100 rounded-lg group-hover:scale-110 transition-transform">
                        {React.cloneElement(app.icon as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5 object-contain' })}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 line-clamp-2">
                      {app.description}
                    </p>
                  </motion.button>
                ))}
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                  onClick={() => onConnectApp()}
                  className="flex-shrink-0 w-20 flex items-center justify-center bg-white rounded-2xl border border-neutral-200 snap-center group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 rounded-full border-2 border-neutral-200 flex items-center justify-center text-neutral-400 group-hover:border-black group-hover:text-black transition-colors">
                    <ArrowUp size={18} className="rotate-90" />
                  </div>
                </motion.button>
              </div>
            </div>

          </div>
        ) : (
          <div className="w-full max-w-3xl mx-auto px-4 md:px-6 py-4 pb-32 space-y-4">
            {messages.map((msg, index) => (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[75%]`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed font-medium break-words whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-neutral-100 text-black rounded-br-md' 
                      : 'bg-white border border-neutral-200 text-black rounded-bl-md'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-200 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Fixed Bottom Input */}
      <div className="fixed bottom-0 left-0 right-0 md:left-72 z-30">
        {/* Attached Documents Bar */}
        <AnimatePresence>
          {attachedDocs.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mx-2 mb-1 overflow-hidden"
            >
              <div className="flex flex-wrap gap-1.5 p-2 bg-neutral-50 rounded-xl">
                {attachedDocs.map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-neutral-200 text-xs"
                  >
                    <FileText size={12} />
                    <span className="max-w-24 truncate">{doc.name}</span>
                    <button
                      onClick={() => toggleDoc(doc)}
                      className="p-0.5 hover:bg-neutral-100 rounded"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Input Bar */}
        <div className="mx-2 mb-2 rounded-2xl bg-neutral-100 flex items-end px-3 py-2.5 gap-2">
          {/* File Upload Button */}
          <motion.button 
            onClick={onFileUpload}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 text-neutral-500 hover:text-black flex-shrink-0 mb-0.5"
            title="Upload files"
          >
            <Paperclip size={20} strokeWidth={2} />
          </motion.button>
          
          {/* Text input area */}
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={attachedDocs.length > 0 
              ? `Ask about your ${attachedDocs.length} attached document${attachedDocs.length > 1 ? 's' : ''}...` 
              : "Ask anything..."
            }
            rows={1}
            className="chat-input-textarea flex-1 text-sm text-black placeholder-neutral-400 resize-none overflow-hidden leading-relaxed self-center"
            style={{minHeight: '24px', maxHeight: '120px'}}
          />
          
          {/* Right side icons */}
          <div className="flex items-center flex-shrink-0 gap-3 mb-0.5">
            {inputText.trim() === '' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3"
              >
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 text-neutral-500 hover:text-black"
                  title="Browser enabled"
                >
                  <Globe size={20} strokeWidth={2} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 text-neutral-500 hover:text-black"
                  title="Voice input"
                >
                  <VoiceWave size={20} />
                </motion.button>
              </motion.div>
            )}
            {/* Send button */}
            <motion.button 
              onClick={handleSend}
              disabled={!inputText.trim() && hasPaid}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                inputText.trim() || !hasPaid 
                  ? 'bg-black text-white' 
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <ArrowUp size={18} strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
