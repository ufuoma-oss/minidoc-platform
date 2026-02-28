'use client';

import React from 'react';
import { MiniDocLogo3D } from '../icons/CustomIcons';

interface HeaderProps {
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex justify-center px-4 pt-1">
      <nav className="w-full max-w-7xl flex items-center justify-between px-4 py-3 transition-all duration-300">
        
        {/* Logo */}
        <div 
          className="flex-shrink-0 flex items-center gap-1.5 group cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <div className="relative -mt-2 transform transition-transform group-hover:scale-105 duration-300">
            <MiniDocLogo3D size={44} />
          </div>
          
          <span className="text-2xl font-logo font-bold text-gray-900 tracking-tight leading-none relative top-[1px]">
            Mini Doc
          </span>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <button 
            onClick={() => onNavigate('signin')}
            className="text-sm font-bold text-gray-600 hover:text-[#FF5A36] px-4 py-2 transition-colors rounded-lg hover:bg-black/5"
          >
            Sign in
          </button>
          <button 
            onClick={() => onNavigate('signin')}
            className="text-sm font-bold text-white bg-[#FF5A36] hover:bg-[#E04826] px-5 py-2 rounded-xl transition-all shadow-lg hover:shadow-orange-500/20"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Action */}
        <div className="md:hidden">
          <button 
            onClick={() => onNavigate('signin')}
            className="text-sm font-bold text-white bg-[#FF5A36] hover:bg-[#E04826] px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-orange-500/20"
          >
            Sign in
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
