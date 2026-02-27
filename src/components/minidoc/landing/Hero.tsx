'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';
import { GmailLogo } from '../icons/CustomIcons';

interface HeroProps {
  onNavigate: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative min-h-screen w-full bg-[#EAE9E5] overflow-hidden flex flex-col font-serif">
      
      <div className="flex-grow flex flex-col items-center justify-center px-4 relative z-10 pt-32 pb-10">
        
        <div className="text-center max-w-4xl mx-auto mb-10 relative z-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-black tracking-tight mb-6 leading-[1.15]">
            Turn your data into your AI personal assistant
          </h1>
          <p className="text-base md:text-lg text-gray-800 max-w-2xl mx-auto leading-relaxed px-4 font-medium">
            Mini Doc connects to your data across all your platforms, so you can ask questions about your own information and automate everyday tasks through simple chat.
          </p>
        </div>

        {/* Input Bar */}
        <div className="w-full max-w-2xl px-4 relative z-30 mb-12">
          <div 
            onClick={() => onNavigate('signin')}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 flex items-center cursor-pointer hover:shadow-md transition-shadow duration-300"
          >
            <input 
              type="text" 
              placeholder="Ask anything in your files..." 
              className="flex-grow bg-transparent border-none outline-none text-lg px-4 text-gray-800 placeholder-gray-400 font-sans cursor-pointer pointer-events-none"
              readOnly
            />
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-xl transition-colors">
              <ArrowUp size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* App Icons Row */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 relative z-30">
          {/* Gmail */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center hover:-translate-y-1 transition-transform duration-300">
            <GmailLogo size={32} />
          </div>
          
          {/* Google Drive */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center hover:-translate-y-1 transition-transform duration-300">
            <img 
              src="https://res.cloudinary.com/dfbh21zqc/image/upload/v1767457510/new-logo-drive-google_lzbhbn.svg" 
              alt="Google Drive" 
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
            />
          </div>
          
          {/* LinkedIn */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center hover:-translate-y-1 transition-transform duration-300">
            <img 
              src="https://res.cloudinary.com/dfbh21zqc/image/upload/v1767457510/linkedin-icon-2_zkw9p5.svg" 
              alt="LinkedIn" 
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
            />
          </div>
          
          {/* Outlook */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center hover:-translate-y-1 transition-transform duration-300">
            <img 
              src="https://res.cloudinary.com/dfbh21zqc/image/upload/v1767457512/outlook-icon_sj6di5.svg" 
              alt="Outlook" 
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
            />
          </div>

          {/* Google Calendar */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center hover:-translate-y-1 transition-transform duration-300">
            <img 
              src="https://res.cloudinary.com/dfbh21zqc/image/upload/v1767542094/google-calendar-icon-2020-_h3xvup.svg" 
              alt="Google Calendar" 
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
