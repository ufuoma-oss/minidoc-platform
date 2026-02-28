'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { UploadCloud, MessageCircleQuestion, CalendarClock, MailCheck, Sparkles, ArrowRight } from 'lucide-react';
import { GmailLogo, UploadFileLogo } from '../icons/CustomIcons';

interface ProblemSolutionProps {
  onNavigate: (page: string) => void;
}

const Typewriter = () => {
  const phrases = useMemo(() => [
    '"Scan my emails for what needs my immediate attention." 🚨',
    '"Compile all last month\'s receipts into a spreadsheet." 📊',
    '"Create this week\'s plan and add all tasks to my to-do list." ✅',
    '"Make a PDF with all letters from my lawyer." ⚖️',
    '"Reply to the immigration office email." ✉️',
    '"What does this letter want from me?" 📄'
  ], []);
  
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(40);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (text.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setText(currentPhrase.slice(0, text.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2500);
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => {
          setText(currentPhrase.slice(0, text.length - 1));
        }, 20);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 500);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, phraseIndex, typingSpeed, phrases]);

  useEffect(() => {
    if (!isDeleting) {
      const timer = setTimeout(() => {
        setTypingSpeed(30 + Math.random() * 20);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [text, isDeleting]);

  return (
    <span className="block min-h-[4rem] sm:min-h-[3rem] font-medium text-[#FF5A36] mt-2 transition-all leading-snug font-serif">
      {text}
      <span className="animate-pulse ml-0.5 text-[#FF5A36]">|</span>
    </span>
  );
};

const features = [
  {
    icon: UploadCloud,
    title: 'Connect & Upload',
    desc: (
      <div className="space-y-4">
        <p className="text-gray-700 font-serif">Connect your apps & upload paperwork, documents, and notes to get started.</p>
        <div className="flex items-center gap-2 pt-2 flex-wrap">
          <div className="p-2 bg-[#F8F7F4] border border-gray-200 rounded-xl hover:scale-110 transition-transform" title="Gmail">
            <GmailLogo size={24} />
          </div>
          <div className="p-2 bg-[#F8F7F4] border border-gray-200 rounded-xl hover:scale-110 transition-transform" title="Google Drive">
            <img src="https://res.cloudinary.com/dfbh21zqc/image/upload/v1767457510/new-logo-drive-google_lzbhbn.svg" alt="Drive" className="w-6 h-6 object-contain" />
          </div>
          <div className="p-2 bg-[#F8F7F4] border border-gray-200 rounded-xl hover:scale-110 transition-transform" title="Outlook">
            <img src="https://res.cloudinary.com/dfbh21zqc/image/upload/v1767457512/outlook-icon_sj6di5.svg" alt="Outlook" className="w-6 h-6 object-contain" />
          </div>
          <div className="p-2 bg-[#F8F7F4] border border-gray-200 rounded-xl hover:scale-110 transition-transform" title="Google Calendar">
            <img src="https://res.cloudinary.com/dfbh21zqc/image/upload/v1767542094/google-calendar-icon-2020-_h3xvup.svg" alt="Calendar" className="w-6 h-6 object-contain" />
          </div>
          <div className="p-2 bg-[#F8F7F4] border border-gray-200 rounded-xl hover:scale-110 transition-transform" title="Google Sheets">
            <img src="https://res.cloudinary.com/dfbh21zqc/image/upload/v1767457511/google-sheets-logo-icon_eigzif.svg" alt="Sheets" className="w-6 h-6 object-contain" />
          </div>
          <div className="p-2 bg-[#F8F7F4] border border-gray-200 rounded-xl hover:scale-110 transition-transform" title="Upload Files">
            <UploadFileLogo size={24} />
          </div>
        </div>
      </div>
    ),
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: MessageCircleQuestion,
    title: 'Ask or Automate',
    desc: (
      <>
        <span className="text-gray-700 font-serif">Just ask in simple words:</span>
        <Typewriter />
      </>
    ),
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: CalendarClock,
    title: 'Calendar Help',
    desc: (
      <div className="space-y-4">
        <p className="text-gray-700 font-serif">Mini Doc adds appointments and important dates to your calendar so you never forget.</p>
        <div className="bg-[#F8F7F4] border border-gray-200 rounded-xl p-3.5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
          <div className="flex gap-3">
            <div className="mt-0.5 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">Mini Doc AI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              </div>
              <p className="text-sm font-bold text-gray-900 leading-snug font-serif">
                "Your appointment has been added to your calendar for <span className="text-indigo-600">Tuesday at 2:00 PM</span>."
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: MailCheck,
    title: 'Write & Send',
    desc: (
      <div className="space-y-4">
        <p className="text-gray-700 font-serif">Manage your emails, chat, reply professionally and securely.</p>
        <div className="bg-[#F8F7F4] border border-gray-200 rounded-xl p-3.5 relative overflow-hidden group transition-all hover:border-gray-300 cursor-default">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <div className="flex gap-3">
            <div className="mt-0.5 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">Mini Doc AI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              </div>
              <p className="text-sm font-bold text-gray-900 leading-snug mb-2 font-serif">
                "I&apos;ve drafted a professional reply to your landlord. Ready to review?"
              </p>
              
              <div className="bg-white rounded-lg p-2 border border-gray-100 flex items-center justify-between group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-7 h-7 rounded bg-gray-50 border border-gray-200 flex items-center justify-center text-blue-600 shrink-0">
                    <MailCheck size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate font-serif">Draft: Lease Inquiry</p>
                    <p className="text-[10px] text-gray-500 truncate font-serif">To: Landlord • Ready to send</p>
                  </div>
                </div>
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 group-hover:text-blue-600 group-hover:border-blue-200">
                  <ArrowRight size={12} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    color: 'bg-green-50 text-green-600',
  },
];

const ProblemSolution: React.FC<ProblemSolutionProps> = ({ onNavigate }) => {
  return (
    <section className="py-24 px-4 bg-[#EAE9E5] relative border-b border-gray-200/50 font-serif">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest font-sans">The Old Way</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-black leading-tight mb-6 tracking-tight">
              Your important information is scattered across,
            </h2>
            <p className="text-lg text-gray-800 font-medium leading-relaxed font-serif">
              Emails, PDFs, apps, paper documents, screenshots, and cloud drives. You lose track of records, unorganized, and it becomes hard to manage across work, school, and daily life.
            </p>
          </div>

          <div className="relative w-full rounded-2xl border border-gray-200 overflow-hidden shadow-2xl bg-black group">
            <iframe
              src="https://player.cloudinary.com/embed/?cloud_name=dfbh21zqc&public_id=18069232-uhd_3840_2160_24fps_akqo2i&profile=cld-default&autoplay=true&loop=true&muted=true&controls=false&hide_controls=true"
              width="640"
              height="360"
              style={{ height: 'auto', width: '100%', aspectRatio: '640 / 360' }}
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              className="border-0"
            ></iframe>
            <div className="absolute inset-0 z-10 bg-transparent"></div>
          </div>
        </div>

        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-200/50 to-transparent -z-10"></div>
          <span className="bg-[#EAE9E5] px-6 py-2 text-2xl md:text-3xl font-serif font-medium text-black inline-block">
            Mini Doc changes everything.
          </span>
        </div>

        <div>
          <p className="text-center text-xl text-gray-800 max-w-4xl mx-auto mb-16 leading-relaxed font-medium font-serif">
            Mini Doc brings all your knowledge sources into one secure AI digital space. It doesn&apos;t just manage your files, it extracts key details from your content across all connected apps, so you can chat with your data and ask your AI assistant to perform real tasks, not just answer questions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-2xl border border-gray-200 hover:border-orange-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
                  <div className={`p-4 rounded-xl ${feature.color} bg-opacity-10 shrink-0`}>
                    <feature.icon size={28} />
                  </div>
                  <div className="w-full">
                    <h3 className="text-2xl font-serif font-medium text-black mb-2">{feature.title}</h3>
                    <div className="text-gray-700 leading-relaxed font-medium font-serif">
                      {feature.desc}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 p-8 md:p-12 bg-[#1a1a1a] rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gray-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-serif font-medium text-white mb-4 tracking-tight">
              You talk to Mini Doc like your PA.
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8 font-medium font-serif">
              It understands your files, emails, chats, notes, and dates, and handles tasks across all your connected apps, organizing everything and acting on your requests from one simple chat interface.
            </p>
            <button 
              onClick={() => onNavigate('signin')}
              className="text-sm font-bold text-gray-900 bg-white hover:bg-gray-50 px-6 py-3 rounded-full transition-colors cursor-pointer shadow-lg hover:shadow-xl font-sans"
            >
              Get Started Now
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProblemSolution;
