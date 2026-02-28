'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Sparkles, MessageCircle, Send, Upload, Bot, Copy, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppLogo } from '../icons/CustomIcons';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type Step = 'welcome' | 'agent' | 'messaging' | 'upload' | 'complete';
type MessagingPlatform = 'telegram' | 'whatsapp' | 'imessage' | null;

interface PlatformConfig {
  id: MessagingPlatform;
  name: string;
  color: string;
  bg: string;
  customIcon?: React.ReactNode;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  botName: string;
  setupSteps: string[];
  tokenPlaceholder: string;
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: 'telegram',
    name: 'Telegram',
    icon: Send,
    color: 'text-[#0088cc]',
    bg: 'bg-[#0088cc]/10',
    botName: '@MiniDocAI_bot',
    setupSteps: [
      'Open Telegram, search @BotFather',
      'Send /newbot, follow steps',
      'Copy the API token'
    ],
    tokenPlaceholder: '123456789:ABCdef...'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'text-green-600',
    bg: 'bg-green-100',
    customIcon: <WhatsAppLogo size={20} />,
    botName: 'Mini Doc Business',
    setupSteps: [
      'Go to Meta Business Suite',
      'Create WhatsApp Business',
      'Generate API key'
    ],
    tokenPlaceholder: 'EAAxxxxxxxx...'
  },
  {
    id: 'imessage',
    name: 'iMessage',
    icon: MessageCircle,
    color: 'text-[#34C759]',
    bg: 'bg-[#34C759]/10',
    botName: 'Mini Doc Business Chat',
    setupSteps: [
      'Register for Apple Business Chat',
      'Set up your Business ID',
      'Generate your API key'
    ],
    tokenPlaceholder: 'BC-xxxxxxxx...'
  }
];

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState<Step>('welcome');
  const [agentName, setAgentName] = useState('');
  const [agentPersonality, setAgentPersonality] = useState('professional');
  
  // Messaging setup state
  const [expandedPlatform, setExpandedPlatform] = useState<MessagingPlatform>(null);
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [connectedPlatforms, setConnectedPlatforms] = useState<Record<string, boolean>>({});
  const [copiedBotName, setCopiedBotName] = useState(false);

  const steps: Step[] = ['welcome', 'agent', 'messaging', 'upload', 'complete'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex]);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleComplete = () => {
    onComplete();
  };

  const handleCopyBotName = (botName: string) => {
    navigator.clipboard.writeText(botName);
    setCopiedBotName(true);
    setTimeout(() => setCopiedBotName(false), 2000);
  };

  const handleConnectPlatform = (platformId: string) => {
    if (tokens[platformId]?.trim()) {
      setConnectedPlatforms(prev => ({ ...prev, [platformId]: true }));
      setTokens(prev => ({ ...prev, [platformId]: '' }));
      setExpandedPlatform(null);
    }
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
                <Bot size={32} className="text-white" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-medium text-black mb-2">Welcome to Mini Doc</h2>
              <p className="text-neutral-600">Let&apos;s set up your personal AI assistant in just a few steps.</p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4">
              {[
                { icon: Bot, label: 'Create Agent', color: 'bg-violet-100 text-violet-600' },
                { icon: MessageCircle, label: 'Connect Apps', color: 'bg-green-100 text-green-600' },
                { icon: Upload, label: 'Add Files', color: 'bg-blue-100 text-blue-600' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="p-4 bg-neutral-50 rounded-xl"
                >
                  <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <item.icon size={20} />
                  </div>
                  <p className="text-xs font-medium text-black">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'agent':
        return (
          <motion.div
            key="agent"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Bot size={24} />
              </div>
              <h2 className="text-xl font-medium text-black mb-2">Name Your AI Agent</h2>
              <p className="text-sm text-neutral-600">Give your assistant a name and personality.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-2">Agent Name</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="e.g., Alex, Mini, Assistant..."
                  className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-2">Personality</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'professional', label: 'Professional', desc: 'Formal & precise' },
                    { id: 'friendly', label: 'Friendly', desc: 'Warm & casual' },
                    { id: 'concise', label: 'Concise', desc: 'Brief & direct' },
                    { id: 'detailed', label: 'Detailed', desc: 'Thorough & in-depth' }
                  ].map((p) => (
                    <motion.button
                      key={p.id}
                      onClick={() => setAgentPersonality(p.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-xl text-left border transition-colors ${
                        agentPersonality === p.id
                          ? 'border-black bg-black/5'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <p className="text-sm font-medium text-black">{p.label}</p>
                      <p className="text-xs text-neutral-500">{p.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'messaging':
        return (
          <motion.div
            key="messaging"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MessageCircle size={24} />
              </div>
              <h2 className="text-xl font-medium text-black mb-1">Connect Messaging Apps</h2>
              <p className="text-sm text-neutral-600">Access your AI agent anywhere.</p>
            </div>

            <div className="space-y-2">
              {PLATFORMS.map((platform) => (
                <div key={platform.id}>
                  {/* Platform Button */}
                  <motion.button
                    onClick={() => setExpandedPlatform(expandedPlatform === platform.id ? null : platform.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-neutral-200 hover:border-black/30 text-left"
                  >
                    <div className={`w-10 h-10 ${platform.bg} rounded-xl flex items-center justify-center`}>
                      {platform.customIcon || <platform.icon size={20} className={platform.color} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-black">{platform.name}</p>
                        {connectedPlatforms[platform.id!] && (
                          <CheckCircle2 size={14} className="text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-500">
                        {connectedPlatforms[platform.id!] ? 'Connected' : 'Click to set up'}
                      </p>
                    </div>
                    <ArrowRight 
                      size={16} 
                      className={`text-neutral-400 transition-transform ${expandedPlatform === platform.id ? 'rotate-90' : ''}`} 
                    />
                  </motion.button>

                  {/* Expanded Setup */}
                  <AnimatePresence>
                    {expandedPlatform === platform.id && !connectedPlatforms[platform.id!] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 bg-neutral-50 rounded-xl mt-2 space-y-3">
                          {/* Setup Steps */}
                          <div className="space-y-1.5">
                            {platform.setupSteps.map((stepText, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="w-5 h-5 bg-black text-white text-[10px] font-medium rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                <span className="text-xs text-neutral-700">{stepText}</span>
                              </div>
                            ))}
                          </div>

                          {/* Bot Name Copy */}
                          <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-neutral-200">
                            <span className="text-xs text-neutral-500">{platform.botName}</span>
                            <motion.button
                              onClick={() => handleCopyBotName(platform.botName)}
                              whileTap={{ scale: 0.95 }}
                              className="p-1 text-neutral-400 hover:text-black"
                            >
                              {copiedBotName ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                            </motion.button>
                          </div>

                          {/* Token Input */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={tokens[platform.id!] || ''}
                              onChange={(e) => setTokens(prev => ({ ...prev, [platform.id!]: e.target.value }))}
                              placeholder={platform.tokenPlaceholder}
                              className="flex-1 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono focus:outline-none focus:border-black"
                            />
                            <motion.button
                              onClick={() => handleConnectPlatform(platform.id!)}
                              disabled={!tokens[platform.id!]?.trim()}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="px-3 py-2 bg-black text-white text-xs font-medium rounded-lg disabled:opacity-50"
                            >
                              Connect
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <p className="text-xs text-center text-neutral-500">
              You can always add more in Settings → Messaging
            </p>
          </motion.div>
        );

      case 'upload':
        return (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Upload size={24} />
              </div>
              <h2 className="text-xl font-medium text-black mb-2">Add Your Files</h2>
              <p className="text-sm text-neutral-600">Upload documents for your AI to understand.</p>
            </div>

            <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-8 text-center hover:border-black/30 transition-colors cursor-pointer">
              <Upload size={32} className="text-neutral-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-black mb-1">Drop files here or click to upload</p>
              <p className="text-xs text-neutral-500">PDF, Word, Images • Max 50MB</p>
            </div>

            <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl">
              <Sparkles size={16} className="text-violet-500" />
              <p className="text-xs text-neutral-600">
                Your AI can search and reference your uploaded files when answering questions.
              </p>
            </div>

            <p className="text-xs text-center text-neutral-500">
              You can upload files anytime from the Library tab
            </p>
          </motion.div>
        );

      case 'complete':
        return (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <Check size={32} />
            </div>
            
            <div>
              <h2 className="text-2xl font-medium text-black mb-2">You&apos;re All Set!</h2>
              <p className="text-neutral-600">Your AI assistant is ready to help you be more productive.</p>
            </div>

            <div className="bg-neutral-50 rounded-xl p-4 space-y-3">
              {[
                { label: 'Agent Created', check: true },
                { label: 'Apps Ready to Connect', check: true },
                { label: 'Storage Available', check: true }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check size={14} className="text-green-600" />
                  <span className="text-sm text-black">{item.label}</span>
                </div>
              ))}
            </div>

            <motion.button
              onClick={handleComplete}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-black text-white font-medium rounded-xl flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              Start Using Mini Doc
            </motion.button>
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-neutral-200"
      >
        {/* Progress bar */}
        {step !== 'complete' && (
          <div className="px-5 pt-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {steps.slice(0, -1).map((s, i) => (
                  <div
                    key={s}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i <= currentIndex ? 'bg-black' : 'bg-neutral-200'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleSkip}
                className="text-xs font-medium text-neutral-500 hover:text-black"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {step !== 'welcome' && step !== 'complete' && (
          <div className="px-5 pb-5 flex gap-3">
            <motion.button
              onClick={handleBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-neutral-100 text-black font-medium rounded-xl flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </motion.button>
            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-black text-white font-medium rounded-xl flex items-center justify-center gap-2"
            >
              Next
              <ArrowRight size={16} />
            </motion.button>
          </div>
        )}

        {step === 'welcome' && (
          <div className="px-5 pb-5">
            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-black text-white font-medium rounded-xl flex items-center justify-center gap-2"
            >
              Let&apos;s Get Started
              <ArrowRight size={16} />
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default OnboardingModal;
