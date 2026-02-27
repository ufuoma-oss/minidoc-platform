import React from 'react';

export const GmailLogo = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2 5.5V18.5C2 19.6046 2.89543 20.5 4 20.5H7V10.75L2 6.875V5.5Z" fill="#4285F4"/>
    <path d="M17 10.75V20.5H20C21.1046 20.5 22 19.6046 22 18.5V5.5L17 9.375V10.75Z" fill="#34A853"/>
    <path d="M2 5.5L12 13.25L22 5.5V4.5C22 3.39543 21.1046 2.5 20 2.5H18.5L12 7.5L5.5 2.5H4C2.89543 2.5 2 3.39543 2 4.5V5.5Z" fill="#EA4335"/>
    <path d="M22 5.5V4.5C22 3.39543 21.1046 2.5 20 2.5H18.5L22 5.5Z" fill="#FBBC04"/>
    <path d="M2 5.5V4.5C2 3.39543 2.89543 2.5 4 2.5H5.5L2 5.5Z" fill="#C5221F"/>
  </svg>
);

export const DriveLogo = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8.66667 3.5H15.3333L22 15H15.3333L8.66667 3.5Z" fill="#34A853"/>
    <path d="M15.3333 3.5L22 15L18.6667 20.8333L12 9.33333L15.3333 3.5Z" fill="#FBBC04"/>
    <path d="M8.66667 3.5L12 9.33333L5.33333 20.8333L2 15L8.66667 3.5Z" fill="#4285F4"/>
  </svg>
);

export const OutlookLogo = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M11 5H18.5C19.6046 5 20.5 5.89543 20.5 7V17C20.5 18.1046 19.6046 19 18.5 19H11" stroke="#0078D4" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 7L13.5 12L10.5 9.5" stroke="#0078D4" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3"/>
    <rect x="3.5" y="5" width="12" height="12" rx="1.5" fill="#0078D4"/>
    <text x="9.5" y="13.5" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="sans-serif">O</text>
  </svg>
);

export const WhatsAppLogo = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <img
    src="https://res.cloudinary.com/dfbh21zqc/image/upload/v1767542092/whatsapp_174879_fuq3bw.png"
    alt="WhatsApp"
    width={size}
    height={size}
    className={className}
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
);

export const GoogleCalendarLogo = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="4" fill="white"/>
    <path d="M2 10V6C2 3.79086 3.79086 2 6 2H10" stroke="#EA4335" strokeWidth="3" strokeLinecap="round"/>
    <path d="M2 14V18C2 20.2091 3.79086 22 6 22H10" stroke="#4285F4" strokeWidth="3" strokeLinecap="round"/>
    <path d="M14 22H18C20.2091 22 22 20.2091 22 18V14" stroke="#34A853" strokeWidth="3" strokeLinecap="round"/>
    <path d="M22 10V6C22 3.79086 20.2091 2 18 2H14" stroke="#FBBC04" strokeWidth="3" strokeLinecap="round"/>
    <text x="12" y="16" textAnchor="middle" fill="#4285F4" fontSize="10" fontFamily="sans-serif" fontWeight="bold">31</text>
  </svg>
);

export const UploadFileLogo = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="4" fill="#6366F1"/>
    <path d="M12 8V16M12 8L9 11M12 8L15 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 16H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const VoiceWave = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" x2="12" y1="5" y2="19" />
    <line x1="8" x2="8" y1="9" y2="15" />
    <line x1="16" x2="16" y1="9" y2="15" />
    <line x1="4" x2="4" y1="11" y2="13" />
    <line x1="20" x2="20" y1="11" y2="13" />
  </svg>
);

export const ModernMenuIcon = ({ className = "" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="7" width="18" height="2" rx="1" fill="currentColor" />
    <rect x="3" y="15" width="12" height="2" rx="1" fill="currentColor" />
  </svg>
);

export const XLogo = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export const ModernAppsIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="3" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="2" />
    <rect x="13" y="3" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="2" />
    <rect x="13" y="13" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="2" />
    <rect x="3" y="13" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// Original orange logo (kept for reference)
export const MiniDocLogo = ({ size = 44, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14 15H4C4 21 8 25 14 25V15Z" fill="#FF5A36"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M14 14C14 11.7909 15.7909 10 18 10H28C30.2091 10 32 11.7909 32 14V19H44C46.2091 19 48 20.7909 48 23V38C48 40.2091 46.2091 42 44 42H18C15.7909 42 14 40.2091 14 38V14Z" fill="#FF5A36"/>
    <rect x="20" y="27" width="12" height="4" rx="2" fill="white"/>
    <rect x="20" y="34" width="20" height="4" rx="2" fill="white"/>
  </svg>
);

// Fun 3D Mockup Style Logo - Fancy, sweet, fun AI agent vibe
export const MiniDocLogo3D = ({ size = 44, className = "", animated = false }: { size?: number; className?: string; animated?: boolean }) => {
  const animationStyle = animated ? {
    style: {
      animation: 'logoFloat 3s ease-in-out infinite',
    }
  } : {};

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      {...animationStyle}
    >
      <defs>
        {/* Main body gradient - sleek dark with depth */}
        <linearGradient id="mainBodyGradient" x1="4" y1="8" x2="50" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3A3A3A"/>
          <stop offset="30%" stopColor="#252525"/>
          <stop offset="70%" stopColor="#151515"/>
          <stop offset="100%" stopColor="#0A0A0A"/>
        </linearGradient>
        
        {/* Tab gradient - slightly lighter for depth */}
        <linearGradient id="tabGradient" x1="0" y1="12" x2="20" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#505050"/>
          <stop offset="50%" stopColor="#353535"/>
          <stop offset="100%" stopColor="#252525"/>
        </linearGradient>
        
        {/* Top highlight for 3D pop */}
        <linearGradient id="topHighlight" x1="0" y1="8" x2="0" y2="25" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.25)"/>
          <stop offset="40%" stopColor="rgba(255,255,255,0.08)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </linearGradient>
        
        {/* Side shadow for depth */}
        <linearGradient id="sideShadow" x1="48" y1="0" x2="30" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(0,0,0,0.4)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </linearGradient>
        
        {/* Document lines gradient */}
        <linearGradient id="lineGradient" x1="20" y1="27" x2="40" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F0F0F0"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#E5E5E5"/>
        </linearGradient>
        
        {/* Drop shadow filter */}
        <filter id="dropShadow3D" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4"/>
        </filter>
        
        {/* Inner glow for fun vibe */}
        <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      
      {/* Background shadow layer for floating effect */}
      <g opacity="0.3">
        <path d="M15 16H5C5 22 9 26 15 26V16Z" fill="#000" transform="translate(2, 2)"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M15 15C15 12.7909 16.7909 11 19 11H29C31.2091 11 33 12.7909 33 15V20H45C47.2091 20 49 21.7909 49 24V39C49 41.2091 47.2091 43 45 43H19C16.7909 43 15 41.2091 15 39V15Z" fill="#000" transform="translate(2, 2)"/>
      </g>
      
      {/* Main logo group with shadow */}
      <g filter="url(#dropShadow3D)">
        {/* Tab part (curved piece on left) */}
        <path 
          d="M14 15H4C4 21 8 25 14 25V15Z" 
          fill="url(#tabGradient)"
        />
        
        {/* Main folder body */}
        <path 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M14 14C14 11.7909 15.7909 10 18 10H28C30.2091 10 32 11.7909 32 14V19H44C46.2091 19 48 20.7909 48 23V38C48 40.2091 46.2091 42 44 42H18C15.7909 42 14 40.2091 14 38V14Z" 
          fill="url(#mainBodyGradient)"
        />
        
        {/* Top highlight overlay */}
        <path 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M14 14C14 11.7909 15.7909 10 18 10H28C30.2091 10 32 11.7909 32 14V19H44C46.2091 19 48 20.7909 48 23V38C48 40.2091 46.2091 42 44 42H18C15.7909 42 14 40.2091 14 38V14Z" 
          fill="url(#topHighlight)"
        />
        
        {/* Side shadow for depth */}
        <path 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M14 14C14 11.7909 15.7909 10 18 10H28C30.2091 10 32 11.7909 32 14V19H44C46.2091 19 48 20.7909 48 23V38C48 40.2091 46.2091 42 44 42H18C15.7909 42 14 40.2091 14 38V14Z" 
          fill="url(#sideShadow)"
        />
      </g>
      
      {/* Document lines with glow effect */}
      <g filter="url(#innerGlow)">
        <rect x="20" y="27" width="12" height="4" rx="2" fill="url(#lineGradient)"/>
        <rect x="20" y="34" width="20" height="4" rx="2" fill="url(#lineGradient)"/>
      </g>
      
      {/* Subtle shine sparkle for fun vibe */}
      <circle cx="10" cy="18" r="1.5" fill="rgba(255,255,255,0.6)"/>
      <circle cx="8" cy="20" r="0.8" fill="rgba(255,255,255,0.4)"/>
    </svg>
  );
};
