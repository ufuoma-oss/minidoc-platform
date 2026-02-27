'use client';

import React, { useState } from 'react';
import { ArrowLeft, Mail, Send, MessageSquare, User, ArrowRight } from 'lucide-react';

interface ContactProps {
  onNavigate: (page: string) => void;
}

const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#EAE9E5] font-serif text-gray-900 relative">
      <div className="sticky top-0 z-20 bg-[#EAE9E5]/90 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="group flex items-center text-sm font-bold text-gray-500 hover:text-[#FF5A36] transition-colors font-sans">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <span className="text-sm font-bold text-gray-400 font-sans">Contact Us</span>
        </div>
      </div>

      <main className="max-w-xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-medium text-gray-900 mb-4 tracking-tight">Get in touch</h1>
          <p className="text-gray-600 text-lg font-medium font-serif">
            Have a question or feedback? We&apos;d love to hear from you.
          </p>
        </div>

        {isSent ? (
          <div className="bg-white border border-green-100 rounded-2xl p-8 text-center shadow-sm animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">Message Sent!</h3>
            <p className="text-gray-500 mb-6 font-serif">
              Thanks for reaching out. We&apos;ll get back to you at <span className="font-bold text-gray-900 font-sans">{email}</span> shortly.
            </p>
            <button onClick={() => onNavigate('home')} className="bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-colors font-sans">
              Back to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200/50 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 font-sans">Your Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all font-medium font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 font-sans">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all font-medium font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 font-sans">Message</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea 
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  rows={5}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all font-medium resize-none font-sans"
                ></textarea>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FF5A36] text-white font-bold py-3.5 px-4 rounded-xl hover:bg-[#E04826] hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed font-sans cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Send Message <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}
      </main>

      <footer className="py-12 border-t border-gray-200/50 mt-12 text-center">
        <p className="text-sm text-gray-400 font-sans">© 2026 Mini Doc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Contact;
