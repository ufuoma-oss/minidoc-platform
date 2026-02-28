'use client';

import React, { useState } from 'react';
import { X, User, CreditCard, Shield, Check, ChevronRight, Clock, Search, ArrowLeft, Send, MessageCircle, ChevronDown, Lock, Key, Smartphone, AlertTriangle, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SettingModalType } from '@/lib/minidoc/types';
import { getSession } from '@/lib/minidoc/storage';

interface SettingsModalProps {
  type: SettingModalType;
  onClose: () => void;
  onLogout?: () => void;
}

const faqs = [
  { question: 'How secure is my data?', answer: 'Your data is encrypted, isolated to your account, and never used to train public AI models. What\'s yours stays yours.' },
  { question: 'What can I upload?', answer: 'Upload any document, file, or screenshot. Connect Gmail, Drive, Outlook, and more to sync everything into your smart digital library.' },
  { question: 'How does reference-based retrieval work?', answer: 'Ask your AI agent by date, name, occasion, or any reference. For example: "Find the contract from March" or "What did John send about the project?"' },
  { question: 'Can I cancel anytime?', answer: 'Yes. Cancel instantly from the "Billing & Plan" tab. You\'ll keep access until the end of your billing period.' },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ type, onClose, onLogout }) => {
  const user = getSession();
  const [name, setName] = useState(user?.name || 'John Doe');
  const [email, setEmail] = useState(user?.email || '');
  
  // Support State
  const [search, setSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [supportView, setSupportView] = useState<'menu' | 'contact'>('menu');
  
  // Privacy/Security State
  const [privacyView, setPrivacyView] = useState<'menu' | '2fa' | 'delete'>('menu');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: user?.name || '', email: user?.email || '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!type) return null;

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(search.toLowerCase()) || 
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 1500);
  };

  const handleVerify2FA = () => {
    setIsVerifying2FA(true);
    setTimeout(() => {
      setIsVerifying2FA(false);
      setIs2FAEnabled(true);
      setPrivacyView('menu');
    }, 1500);
  };

  const handleDeleteAccount = () => {
    if (onLogout) onLogout();
  };

  const getTitle = () => {
    switch(type) {
      case 'account': return 'Account';
      case 'billing': return 'Billing & Plan';
      case 'privacy': return 'Privacy & Security';
      case 'support': return supportView === 'contact' ? 'Contact Support' : 'Help & Support';
      case 'messaging': return 'Messaging Apps';
      default: return '';
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'account':
        return (
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center justify-center mb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-neutral-100 border-2 border-neutral-200 rounded-full flex items-center justify-center text-2xl font-medium text-black"
              >
                {name.charAt(0).toUpperCase()}
              </motion.div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Save Changes
            </motion.button>
          </div>
        );
        
      case 'billing':
        return (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs font-medium text-neutral-500 mb-1">Current Plan</p>
                  <h3 className="text-xl font-medium text-black">$2 Trial</h3>
                </div>
                <div className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">Active</div>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <Clock size={14} />
                7 Days Remaining
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative p-5 bg-white border-2 border-black rounded-2xl">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
                Recommended
              </div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-medium text-black">Mini Doc Pro</h3>
                <div className="text-right">
                  <span className="text-xl font-medium text-black">$10</span>
                  <span className="text-xs text-neutral-500">/mo</span>
                </div>
              </div>
              <ul className="space-y-2 mb-5">
                {["2TB Secure Storage", "Personal AI Agent", "Unlimited Integrations", "Priority Support"].map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                    <div className="w-4 h-4 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center">
                      <Check size={10} strokeWidth={3} />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-medium rounded-xl transition-colors"
              >
                Upgrade to Pro
              </motion.button>
            </div>

            <button className="text-xs font-medium text-neutral-400 hover:text-red-500 transition-colors w-full text-center">
              Cancel Subscription
            </button>
          </div>
        );
        
      case 'privacy':
        if (privacyView === '2fa') {
          return (
            <div className="flex flex-col h-full">
              <button 
                onClick={() => setPrivacyView('menu')} 
                className="flex items-center text-xs font-medium text-neutral-500 hover:text-black mb-6 self-start group"
              >
                <ArrowLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>

              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-black mb-2">Setup 2-Factor Auth</h3>
                <p className="text-sm text-neutral-500">Scan this QR code with your authenticator app.</p>
              </div>

              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 mx-auto mb-6">
                <div className="w-40 h-40 bg-black flex items-center justify-center rounded-lg mx-auto">
                  <div className="grid grid-cols-8 grid-rows-8 gap-0.5 p-4">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className={`w-4 h-4 ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`}></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-2">Verification Code</label>
                  <input 
                    type="text" 
                    placeholder="000 000"
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value)}
                    className="w-full text-center p-3 bg-white border border-neutral-200 rounded-xl font-mono text-lg tracking-widest text-black focus:outline-none focus:border-black transition-all"
                  />
                </div>
                <motion.button 
                  onClick={handleVerify2FA}
                  disabled={!twoFACode || isVerifying2FA}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isVerifying2FA ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Verify & Enable'
                  )}
                </motion.button>
              </div>
            </div>
          );
        }

        if (privacyView === 'delete') {
          return (
            <div className="flex flex-col h-full">
              <button 
                onClick={() => setPrivacyView('menu')} 
                className="flex items-center text-xs font-medium text-neutral-500 hover:text-black mb-6 self-start group"
              >
                <ArrowLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>

              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                  <AlertOctagon size={28} />
                </div>
                <h3 className="text-lg font-medium text-black mb-3">Delete Account?</h3>
                <p className="text-sm text-neutral-500 mb-6 leading-relaxed bg-red-50 p-4 rounded-xl border border-red-100">
                  <span className="font-medium text-red-600 block mb-1">Warning: This is permanent.</span>
                  All your documents, chats, and settings will be wiped immediately.
                </p>

                <div className="w-full mb-4">
                  <label className="block text-xs font-medium text-neutral-500 mb-2">
                    Type "DELETE" to confirm
                  </label>
                  <input 
                    type="text"
                    value={deleteConfirmationText}
                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                    placeholder="DELETE"
                    className="w-full p-3 bg-white border border-neutral-300 rounded-xl text-center font-medium text-red-600 focus:outline-none focus:border-red-500"
                  />
                </div>
                
                <div className="space-y-2 w-full">
                  <motion.button 
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmationText !== 'DELETE'}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3 bg-red-600 disabled:bg-neutral-200 disabled:cursor-not-allowed text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Yes, Delete Everything
                  </motion.button>
                  <button 
                    onClick={() => setPrivacyView('menu')}
                    className="w-full py-3 bg-white border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-5">
            {/* Password */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Password</h4>
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Key size={14} className="text-neutral-400" />
                  <h5 className="text-sm font-medium text-black">Change Password</h5>
                </div>
                <input 
                  type="password" 
                  placeholder="Current Password"
                  className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-black"
                />
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    placeholder="New Password"
                    className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-black"
                  />
                  <input 
                    type="password" 
                    placeholder="Confirm"
                    className="w-full p-2.5 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <button className="text-xs text-neutral-400 hover:text-black font-medium">Forgot Password?</button>
                  <button className="px-4 py-2 bg-black text-white text-xs font-medium rounded-lg hover:bg-neutral-800">Update</button>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-medium text-black flex items-center gap-2">
                    <Smartphone size={14} className="text-neutral-400" />
                    Two-Factor Auth
                  </h5>
                  <p className="text-xs text-neutral-500 mt-0.5">Secure your account with 2FA</p>
                </div>
                {is2FAEnabled ? (
                  <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                    <Check size={12} strokeWidth={3} />
                    <span className="text-xs font-medium">Enabled</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => setPrivacyView('2fa')}
                    className="text-xs font-medium text-black border border-neutral-200 bg-white px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Enable
                  </button>
                )}
              </div>
            </div>
            
            <div className="pt-4 border-t border-neutral-200">
              <button 
                onClick={() => setPrivacyView('delete')}
                className="flex items-center gap-2 text-sm text-red-600 font-medium hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
              >
                <AlertTriangle size={16} /> Delete Account & Data
              </button>
            </div>
          </div>
        );
        
      case 'support':
        if (supportView === 'contact') {
          return (
            <div className="flex flex-col h-full">
              <button 
                onClick={() => {
                  setSupportView('menu');
                  setIsSent(false);
                }} 
                className="flex items-center text-xs font-medium text-neutral-500 hover:text-black mb-6 self-start group"
              >
                <ArrowLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to FAQs
              </button>

              {isSent ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-neutral-50 border border-neutral-200 rounded-2xl">
                  <div className="w-12 h-12 bg-neutral-100 text-neutral-600 rounded-full flex items-center justify-center mb-4">
                    <Send size={20} />
                  </div>
                  <h3 className="text-lg font-medium text-black mb-2">Message Sent</h3>
                  <p className="text-sm text-neutral-500 mb-4">We'll get back to you shortly.</p>
                  <button 
                    onClick={() => { setSupportView('menu'); setIsSent(false); }}
                    className="text-xs font-medium text-black underline hover:text-neutral-600"
                  >
                    Return to Support
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-2">How can we help?</label>
                    <textarea 
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      placeholder="Tell us what's happening..."
                      rows={6}
                      className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-black focus:outline-none focus:border-black resize-none"
                    ></textarea>
                  </div>
                  
                  <motion.button 
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Send Message <Send size={16} />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          );
        }

        return (
          <div className="space-y-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              <input 
                type="text" 
                placeholder="Search guides..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-black transition-all text-sm bg-white"
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">FAQ</h4>
              {filteredFaqs.map((faq, idx) => (
                <div key={idx} className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
                  <button 
                    onClick={() => setExpandedFaq(expandedFaq === faq.question ? null : faq.question)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-neutral-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-black pr-4">{faq.question}</span>
                    {expandedFaq === faq.question ? <ChevronDown size={14} className="text-black" /> : <ChevronRight size={14} className="text-neutral-400" />}
                  </button>
                  {expandedFaq === faq.question && (
                    <div className="p-3 pt-0 bg-white text-xs text-neutral-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <motion.button 
                onClick={() => setSupportView('contact')}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 bg-neutral-50 border border-neutral-200 text-black font-medium rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle size={16} /> Contact Support
              </motion.button>
            </div>
          </div>
        );
        
      case 'messaging':
        return (
          <div className="space-y-5">
            <p className="text-sm text-neutral-500">
              Connect messaging apps to access your AI agent anywhere.
            </p>

            {/* Telegram */}
            <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0088cc]/10 rounded-xl flex items-center justify-center">
                  <Send size={20} className="text-[#0088cc]" />
                </div>
                <div>
                  <h5 className="text-sm font-medium text-black">Telegram</h5>
                  <p className="text-xs text-neutral-500">Chat via Telegram bot</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Connect
              </motion.button>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <MessageCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <h5 className="text-sm font-medium text-black">WhatsApp</h5>
                  <p className="text-xs text-neutral-500">Message via WhatsApp</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Connect
              </motion.button>
            </div>

            {/* iMessage */}
            <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#34C759]/10 rounded-xl flex items-center justify-center">
                  <MessageCircle size={20} className="text-[#34C759]" />
                </div>
                <div>
                  <h5 className="text-sm font-medium text-black">iMessage</h5>
                  <p className="text-xs text-neutral-500">Chat via Apple iMessage</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Connect
              </motion.button>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <p className="text-xs text-neutral-500">
                <span className="font-medium text-black">Note:</span> Your AI agent will respond with the same intelligence across all connected platforms.
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
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
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh] border border-neutral-200 relative"
        >
          <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between shrink-0">
            <h2 className="text-lg font-medium text-black">{getTitle()}</h2>
            <button 
              onClick={onClose} 
              className="p-2 -mr-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-5 flex-1 overflow-y-auto">
            {renderContent()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsModal;
