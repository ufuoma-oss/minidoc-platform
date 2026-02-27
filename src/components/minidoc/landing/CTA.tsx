'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CTAProps {
  onNavigate: (page: string) => void;
}

const CTA: React.FC<CTAProps> = ({ onNavigate }) => {
  return (
    <section className="py-24 px-4 bg-transparent relative overflow-hidden border-t border-gray-200/50 font-serif">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-orange-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-12 text-gray-900 leading-tight">
          Get started in less than a minute
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-6 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent -z-10"></div>

          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-sm text-[#FF5A36] flex items-center justify-center font-bold font-sans text-lg mb-4 group-hover:-translate-y-1 transition-transform relative z-10">1</div>
            <span className="text-lg text-gray-800 font-medium font-serif leading-tight">Create your free account</span>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-sm text-[#FF5A36] flex items-center justify-center font-bold font-sans text-lg mb-4 group-hover:-translate-y-1 transition-transform relative z-10">2</div>
            <span className="text-lg text-gray-800 font-medium font-serif leading-tight">Connect an app or upload a document</span>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-sm text-[#FF5A36] flex items-center justify-center font-bold font-sans text-lg mb-4 group-hover:-translate-y-1 transition-transform relative z-10">3</div>
            <span className="text-lg text-gray-800 font-medium font-serif leading-tight">Start your first chat</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <button 
            onClick={() => onNavigate('signin')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-[#FF5A36] rounded-2xl hover:bg-[#E04826] hover:shadow-xl hover:shadow-orange-500/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer font-sans"
          >
            Start 7-Day Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
