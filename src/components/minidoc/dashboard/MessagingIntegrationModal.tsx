'use client';

import React, { useState } from 'react';
import { X, Check, ExternalLink, Copy, CheckCircle2, ArrowRight, MessageCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppLogo } from '../icons/CustomIcons';

interface MessagingIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Platform = 'telegram' | 'whatsapp' | 'imessage';
type Step = 'select' | 'setup';

interface PlatformConfig {
  id: Platform;
  name: string;
  icon: React.ReactNode;
  description: string;
  botName: string;
  setupSteps: string[];
  tokenPlaceholder: string;
  docsUrl: string;
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: 'telegram',
    name: 'Telegram',
    icon: <Send size={24} className="text-[#0088cc]" />,
    description: 'Chat with your AI agent through Telegram',
    botName: '@MiniDocAI_bot',
    setupSteps: [
      'Open Telegram and search for @BotFather',
      'Send /newbot and follow the instructions',
      'Copy the API token provided',
      'Paste it below to connect'
    ],
    tokenPlaceholder: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',
    docsUrl: 'https://core.telegram.org/bots#how-do-i-create-a-bot'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: <WhatsAppLogo size={24} />,
    description: 'Access your AI via WhatsApp messaging',
    botName: 'Mini Doc Business',
    setupSteps: [
      'Go to Meta Business Suite',
      'Create a WhatsApp Business Account',
      'Set up a phone number',
      'Generate and copy your API key',
      'Paste it below to connect'
    ],
    tokenPlaceholder: 'EAAxxxxxxxxxxxxxxxxxxxxxxxx',
    docsUrl: 'https://developers.facebook.com/docs/whatsapp/business-management-api'
  },
  {
    id: 'imessage',
    name: 'iMessage',
    icon: <MessageCircle size={24} className="text-[#34C759]" />,
    description: 'Chat with your AI via Apple iMessage',
    botName: 'Mini Doc Business Chat',
    setupSteps: [
      'Register for Apple Business Chat',
      'Set up your Business ID',
      'Configure your messaging endpoint',
      'Generate your API key',
      'Paste it below to connect'
    ],
    tokenPlaceholder: 'BC-xxxxxxxxxxxxxxxxxxxxxxxx',
    docsUrl: 'https://developer.apple.com/business-chat/'
  }
];

const MessagingIntegrationModal: React.FC<MessagingIntegrationModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>('select');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformConfig | null>(null);
  const [token, setToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState<Record<Platform, boolean>>({
    telegram: false,
    whatsapp: false,
    imessage: false
  });
  const [copiedBotName, setCopiedBotName] = useState(false);

  const handleSelectPlatform = (platform: PlatformConfig) => {
    setSelectedPlatform(platform);
    setStep('setup');
  };

  const handleBack = () => {
    setStep('select');
    setSelectedPlatform(null);
    setToken('');
  };

  const handleConnect = () => {
    if (!selectedPlatform || !token.trim()) return;
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(prev => ({ ...prev, [selectedPlatform.id]: true }));
      setToken('');
      setStep('select');
      setSelectedPlatform(null);
    }, 2000);
  };

  const handleCopyBotName = () => {
    if (selectedPlatform) {
      navigator.clipboard.writeText(selectedPlatform.botName);
      setCopiedBotName(true);
      setTimeout(() => setCopiedBotName(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[85vh] flex flex-col border border-neutral-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-black">
              {step === 'select' ? 'Messaging Integrations' : `Connect ${selectedPlatform?.name}`}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {step === 'select' ? 'Access your AI agent anywhere' : 'Follow the steps below'}
            </p>
          </div>
          <motion.button 
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100"
          >
            <X size={18} />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 'select' ? (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                <p className="text-sm text-neutral-600 mb-4">
                  Connect your favorite messaging apps to access your AI agent from anywhere.
                </p>

                {PLATFORMS.map((platform, index) => (
                  <motion.button
                    key={platform.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSelectPlatform(platform)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-neutral-200 hover:border-black/30 hover:bg-neutral-50 text-left group transition-all"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      {platform.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-black">{platform.name}</h3>
                        {isConnected[platform.id] && (
                          <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                            <CheckCircle2 size={12} /> Connected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">{platform.description}</p>
                    </div>
                    <ArrowRight size={18} className="text-neutral-400 group-hover:text-black transition-colors" />
                  </motion.button>
                ))}

                <div className="mt-4 p-3 bg-neutral-100 rounded-xl">
                  <p className="text-xs text-neutral-600">
                    <span className="font-medium text-black">Tip:</span> Your AI agent will respond with the same intelligence across all connected platforms.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="setup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Back button */}
                <button 
                  onClick={handleBack}
                  className="text-xs font-medium text-neutral-500 hover:text-black flex items-center gap-1"
                >
                  ← Back to platforms
                </button>

                {selectedPlatform && (
                  <>
                    {/* Platform header */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center">
                        {selectedPlatform.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-black">{selectedPlatform.name}</h3>
                        <p className="text-xs text-neutral-500">{selectedPlatform.description}</p>
                      </div>
                    </div>

                    {/* Setup steps */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Setup Guide</h4>
                      <div className="space-y-2">
                        {selectedPlatform.setupSteps.map((stepText, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                            <span className="w-5 h-5 bg-black text-white text-xs font-medium rounded-full flex items-center justify-center flex-shrink-0">
                              {index + 1}
                            </span>
                            <p className="text-sm text-neutral-700">{stepText}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bot name copy */}
                    <div className="flex items-center justify-between p-3 bg-neutral-100 rounded-lg">
                      <div>
                        <p className="text-xs text-neutral-500">Bot/Account</p>
                        <p className="text-sm font-medium text-black">{selectedPlatform.botName}</p>
                      </div>
                      <motion.button
                        onClick={handleCopyBotName}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-neutral-500 hover:text-black rounded-lg hover:bg-neutral-200"
                      >
                        {copiedBotName ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                      </motion.button>
                    </div>

                    {/* Token input */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500">API Token / Key</label>
                      <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder={selectedPlatform.tokenPlaceholder}
                        className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-sm text-black font-mono focus:outline-none focus:border-black"
                      />
                    </div>

                    {/* Help link */}
                    <a
                      href={selectedPlatform.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-neutral-500 hover:text-black"
                    >
                      <ExternalLink size={12} />
                      Need help? View documentation
                    </a>

                    {/* Connect button */}
                    <motion.button
                      onClick={handleConnect}
                      disabled={!token.trim() || isConnecting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-black text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isConnecting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          Connect {selectedPlatform.name}
                        </>
                      )}
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MessagingIntegrationModal;
