'use client';

import React from 'react';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaywallModalProps {
  onClose: () => void;
  onPayment: () => void;
  onSkipToBilling: () => void;
  isLoading: boolean;
}

const benefits = [
  { title: 'Your AI Assistant', desc: 'Handles questions, tasks, and everyday work.' },
  { title: 'Chat With Your Data', desc: 'Get instant answers from your documents.' },
  { title: 'AI Document Library', desc: 'AI understands and manages all your files.' },
  { title: '2TB Secure Storage', desc: 'Upload and manage up to 2TB of files.' },
];

const PaywallModal: React.FC<PaywallModalProps> = ({ onClose, onPayment, onSkipToBilling, isLoading }) => {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-neutral-500 hover:text-black bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="bg-black p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl mb-4 border border-white/20"
              >
                <Sparkles size={28} className="text-white" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-medium text-white mb-1"
              >
                Unlock Mini Doc Pro
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-white font-medium text-base mb-0.5"
              >
                7-Day Trial – Just $2
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-neutral-400 text-xs"
              >
                Full access to your personal AI.
              </motion.p>
            </div>
          </div>

          {/* Benefits */}
          <div className="p-6">
            <div className="space-y-3 mb-6">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-black">{benefit.title}</h4>
                    <p className="text-xs text-neutral-500">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button 
              onClick={onPayment}
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white text-base font-medium rounded-xl transition-colors flex items-center justify-center gap-2 group disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Start 7-Day Trial</span>
                  <span className="bg-white text-black px-2 py-0.5 rounded text-sm font-medium">$2</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>

            {/* Skip Trial Link */}
            <motion.button 
              onClick={onSkipToBilling}
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full mt-3 py-2 text-xs font-medium text-neutral-500 hover:text-black transition-colors"
            >
              Know what you want? <span className="underline">Skip trial & subscribe for $10/mo</span>
            </motion.button>
            
            <p className="text-[10px] text-center text-neutral-400 mt-4 font-medium">
              Secured by Stripe • Cancel anytime
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaywallModal;
