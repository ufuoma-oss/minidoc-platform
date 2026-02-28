'use client';

import { motion } from 'motion/react';
import { SplittingText } from './texts/SplittingText';
import { MotionEffect } from './effects/MotionEffect';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

const TITLE = 'Turn your data into your personal AI agent';
const SUBTITLE = 'Your paperwork, emails, data, and files are organized and managed by your AI to get real work done for you.';

const apps = [
  { name: 'Gmail', logo: 'https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_48dp.png' },
  { name: 'Calendar', logo: 'https://www.gstatic.com/images/branding/product/2x/calendar_2020q4_48dp.png' },
  { name: 'Outlook', logo: 'https://img.icons8.com/color/96/microsoft-outlook-2019.png' },
  { name: 'Sheets', logo: 'https://img.icons8.com/color/96/google-sheets.png' },
  { name: 'Drive', logo: 'https://www.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png' },
  { name: 'More', logo: null, isPlus: true },
];

export const Hero = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  return (
    <div className="relative overflow-hidden flex flex-col items-center px-5">
      <div className="relative z-10 flex flex-col items-center justify-center pt-30">
        {/* Badge */}
        <MotionEffect
          slide={{ direction: 'down' }}
          fade
          zoom
          inView
        >
          <div className="mb-8 rounded-full bg-accent py-1 pl-1 pr-3 text-sm flex items-center gap-2">
            <span className="h-6 px-2 bg-primary text-xs text-primary-foreground rounded-full flex gap-1 items-center justify-center">
              <Sparkles className="w-3 h-3" />
              Agent Mode
            </span>
            <span className="text-muted-foreground">Chat with your data</span>
          </div>
        </MotionEffect>

        {/* Title with double layer effect */}
        <MotionEffect
          slide={{ direction: 'down' }}
          fade
          zoom
          inView
          delay={0.15}
        >
          <div className="relative z-10">
            {/* Background layer - faded, no animation */}
            <h1 className="md:max-w-[800px] max-w-[320px]">
              <SplittingText
                text={TITLE}
                aria-hidden="true"
                className="block md:text-5xl text-4xl font-medium text-center text-neutral-200 dark:text-neutral-800"
                disableAnimation
              />
            </h1>
            {/* Animated layer on top - starts invisible, reveals character by character */}
            <div className="md:max-w-[800px] max-w-[320px] absolute inset-0 flex items-center justify-center pointer-events-none">
              <SplittingText
                text={TITLE}
                className="block md:text-5xl text-4xl font-medium text-center"
                type="chars"
                delay={400}
                initial={{ y: 0, opacity: 0, x: 0, filter: 'blur(10px)' }}
                animate={{ y: 0, opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>
        </MotionEffect>

        {/* Subtitle */}
        <MotionEffect
          slide={{ direction: 'down' }}
          fade
          zoom
          inView
          delay={0.3}
        >
          <p className="block font-normal md:text-lg sm:text-base text-sm text-center mt-3 text-muted-foreground md:max-w-[660px] sm:max-w-[450px] text-balance">
            {SUBTITLE}
          </p>
        </MotionEffect>

        {/* CTA Buttons */}
        <div className="flex sm:flex-row flex-col sm:gap-4 gap-3 mt-5 mb-8 max-sm:w-full">
          <MotionEffect
            slide={{ direction: 'down' }}
            fade
            zoom
            delay={0.45}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="w-full !pr-5"
                variant="default"
                onClick={() => onNavigate?.('signin')}
              >
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </MotionEffect>

          <MotionEffect
            slide={{ direction: 'down' }}
            fade
            zoom
            delay={0.6}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="w-full" variant="outline">
                Learn More
              </Button>
            </motion.div>
          </MotionEffect>
        </div>

        {/* App Icons */}
        <div className="flex items-center gap-4 justify-center">
          {apps.map((app, index) => (
            <MotionEffect
              key={app.name}
              slide={{ direction: 'down' }}
              fade
              zoom
              delay={0.75 + index * 0.1}
            >
              <motion.div 
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center p-1.5"
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {app.isPlus ? (
                  <span className="text-2xl font-semibold text-muted-foreground">+</span>
                ) : app.logo ? (
                  <Image
                    src={app.logo}
                    alt={app.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                ) : null}
              </motion.div>
            </MotionEffect>
          ))}
        </div>
      </div>
    </div>
  );
};
