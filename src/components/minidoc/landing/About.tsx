'use client';

import React from 'react';
import { ArrowLeft, Shield, Zap, Heart, Link2, CalendarCheck } from 'lucide-react';

interface AboutProps {
  onNavigate: (page: string) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#EAE9E5] font-serif text-gray-900 relative">
      <div className="sticky top-0 z-20 bg-[#EAE9E5]/90 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="group flex items-center text-sm font-bold text-gray-500 hover:text-[#FF5A36] transition-colors font-sans">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <span className="text-sm font-bold text-gray-400 font-sans">About Mini Doc</span>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-16">
          <p className="text-xl text-gray-600 leading-relaxed font-medium font-serif">
            Mini Doc is built for anyone who dreads unread emails, messy inboxes, or scattered documents. It helps you stay organized and get things done with AI fast and secure.
          </p>
        </div>

        <div className="grid gap-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-medium text-gray-900">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed font-serif">
              Managing documents, forms, personal data, and emails shouldn&apos;t require a degree. Tax letters, rental agreements, immigration forms, and endless email chains are complex by design. Mini Doc uses advanced AI to simplify it all.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#F2F1ED] border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <Shield className="text-green-600 mb-4" size={24} />
              <h3 className="font-bold text-gray-900 mb-2 font-serif">Private First</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-serif">
                Your emails, files, and chats stay encrypted and isolated in your account, using bank-level security.
              </p>
            </div>

            <div className="p-6 bg-[#F2F1ED] border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <Link2 className="text-blue-500 mb-4" size={24} />
              <h3 className="font-bold text-gray-900 mb-2 font-serif">Fully Connected</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-serif">
                Mini Doc connects to the apps you already use, finding answers wherever they hide.
              </p>
            </div>

            <div className="p-6 bg-[#F2F1ED] border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <Zap className="text-amber-500 mb-4" size={24} />
              <h3 className="font-bold text-gray-900 mb-2 font-serif">It Takes Action</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-serif">
                It doesn&apos;t just find documents or extract information, it understands them. Ask it to send/reply to messages, or automate workflows.
              </p>
            </div>

            <div className="p-6 bg-[#F2F1ED] border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CalendarCheck className="text-[#FF5A36] mb-4" size={24} />
              <h3 className="font-bold text-gray-900 mb-2 font-serif">Never Miss a Date</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-serif">
                Mini Doc spots deadlines, appointments, and important events in emails and documents and adds them to your calendar.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-medium text-gray-900">Who We Are</h2>
            <p className="text-gray-600 text-lg leading-relaxed font-serif">
              We&apos;re a team of engineers, designers, and individuals who struggled with paperwork ourselves. We built Mini Doc to make managing documents, apps, and tasks simple and now we&apos;re sharing it with you.
            </p>
          </section>

          <div className="p-8 bg-gray-900 rounded-3xl text-center mt-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5A36]/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
              <Heart className="mx-auto text-red-500 mb-4" size={32} fill="currentColor" />
              <h3 className="text-2xl font-serif font-medium text-white mb-2">Built with care.</h3>
              <p className="text-gray-400 mb-6 font-medium font-serif">Designed for your peace of mind.</p>
              <button onClick={() => onNavigate('contact')} className="inline-block bg-white text-gray-900 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors font-sans cursor-pointer shadow-lg hover:shadow-xl">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-gray-200/50 mt-12 text-center">
        <p className="text-sm text-gray-400 font-sans">© 2026 Mini Doc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
