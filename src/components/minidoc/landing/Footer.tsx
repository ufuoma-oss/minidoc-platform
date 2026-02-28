'use client';

import React from 'react';
import { Instagram, Linkedin } from 'lucide-react';
import { XLogo, MiniDocLogo } from '../icons/CustomIcons';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer className="py-16 px-6 bg-gray-900 border-t border-gray-800 font-serif">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-1.5 mb-4">
              <div className="relative -mt-2">
                <MiniDocLogo size={44} />
              </div>
              <span className="text-2xl font-logo font-bold text-white tracking-tight leading-none relative top-[1px]">Mini Doc</span>
            </div>
            
            <p className="text-sm text-gray-500 font-medium font-serif mb-6">© 2026 Mini Doc. All rights reserved.</p>
            
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-[#FF5A36] transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-[#FF5A36] transition-colors" aria-label="X (formerly Twitter)"><XLogo size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-[#FF5A36] transition-colors" aria-label="LinkedIn"><Linkedin size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 font-serif">Product</h4>
            <ul className="space-y-3">
              <li><button onClick={(e) => handleNav(e, 'home')} className="text-sm text-gray-400 hover:text-[#FF5A36] transition-colors font-medium font-serif">Features</button></li>
              <li><button onClick={(e) => handleNav(e, 'signin')} className="text-sm text-gray-400 hover:text-[#FF5A36] transition-colors font-medium font-serif">Sign In</button></li>
              <li><button onClick={(e) => handleNav(e, 'signin')} className="text-sm text-gray-400 hover:text-[#FF5A36] transition-colors font-medium font-serif">Get Started</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 font-serif">Company</h4>
            <ul className="space-y-3">
              <li><button onClick={(e) => handleNav(e, 'about')} className="text-sm text-gray-400 hover:text-[#FF5A36] transition-colors font-medium font-serif">About Mini Doc</button></li>
              <li><button onClick={(e) => handleNav(e, 'contact')} className="text-sm text-gray-400 hover:text-[#FF5A36] transition-colors font-medium font-serif">Contact Us</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 font-serif">Legal</h4>
            <ul className="space-y-3">
              <li><button onClick={(e) => handleNav(e, 'privacy')} className="text-sm text-gray-400 hover:text-[#FF5A36] transition-colors font-medium font-serif">Privacy Policy</button></li>
              <li><button onClick={(e) => handleNav(e, 'terms')} className="text-sm text-gray-400 hover:text-[#FF5A36] transition-colors font-medium font-serif">Terms of Service</button></li>
            </ul>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
