"use client";

import Image from "next/image";
import Bucket from "./Bucket";
import Header from "./Header";

interface HeroProps {
  onNavigate: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <>
      <Header onNavigate={onNavigate} />
      <section className="relative border min-h-[calc(100svh-4rem)] overflow-hidden bg-background py-8 md:py-16 lg:py-24 flex flex-col rounded-2xl mx-2 md:mx-4 lg:mx-6">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://raw.githubusercontent.com/iurvish/uselayouts/refs/heads/main/public/background.png"
            alt="Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full px-4 md:px-8 lg:pl-12 lg:pr-0 xl:pl-20 xl:pr-14 flex-1 flex flex-col justify-center">
          <div className="flex flex-col justify-center gap-auto flex-1 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            
            {/* Text Content */}
            <div className="flex flex-col gap-4 items-start justify-center text-left">
              <h1 className="tracking-tighter text-balance text-4xl font-medium md:text-5xl lg:text-6xl text-foreground">
                Turn your data into your personal AI agent.
              </h1>
              <p className="mt-1 text-pretty text-lg leading-tight text-foreground/50 max-w-lg">
                Paperwork, emails, files, and more, organized and activated to get AI working for you.
              </p>

              {/* Chat Input Box */}
              <div className="mt-6 w-full max-w-md">
                <div 
                  className="relative flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl px-4 py-3 shadow-lg cursor-pointer hover:border-border transition-colors"
                  onClick={() => onNavigate("signin")}
                >
                  <svg 
                    className="w-5 h-5 text-muted-foreground shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                  <span className="text-muted-foreground text-sm flex-1">
                    Ask anything in your file...
                  </span>
                  <div className="flex items-center gap-1 bg-primary/10 rounded-lg px-2 py-1">
                    <svg 
                      className="w-3 h-3 text-primary" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" 
                      />
                    </svg>
                    <span className="text-xs text-primary font-medium">AI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bucket Visualization */}
            <div className="flex-1 flex justify-center items-center w-full mt-8 lg:mt-0 lg:justify-end">
              <div className="w-full max-w-[600px]">
                <Bucket />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
