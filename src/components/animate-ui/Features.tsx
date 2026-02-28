'use client';

import { MotionEffect } from './effects/MotionEffect';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { 
  FileText, 
  Link2,
  Shield,
  Brain,
  Layers,
  Lightbulb,
  Mail,
  Upload,
  Database,
  Clock,
  Sparkles,
  Briefcase,
  Users,
  FileCheck,
  Calendar,
  FolderOpen,
  Receipt,
  GraduationCap,
  Home,
  Scale,
  Stethoscope,
} from 'lucide-react';

const FEATURES = [
  {
    title: 'Smart Digital Library',
    description: 'Upload docs, work files, screenshots — any data you want your AI to access. All in one place.',
    icon: Database,
    color: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Deep Document Intelligence',
    description: 'Reads and understands PDFs, slides, contracts, and emails instantly.',
    icon: Brain,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Reference-Based Retrieval',
    description: 'Pull info by date, name, occasion, or any reference point from your digital library.',
    icon: Clock,
    color: 'from-cyan-500 to-teal-500',
  },
  {
    title: 'Multi-Platform Sync',
    description: 'Connect Gmail, Drive, and more. Sync everything into one unified AI workspace.',
    icon: Link2,
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Context Awareness',
    description: 'Understands relationships between your documents, conversations, and projects.',
    icon: Layers,
    color: 'from-pink-500 to-rose-500',
  },
  {
    title: 'PDF & Slide Creation',
    description: 'Generate polished documents and presentations in seconds.',
    icon: FileText,
    color: 'from-red-500 to-orange-500',
  },
  {
    title: 'Instant Insights',
    description: 'Summaries, key points, action items — automatically extracted for you.',
    icon: Lightbulb,
    color: 'from-yellow-500 to-amber-500',
  },
  {
    title: 'Email Management',
    description: 'Read, draft, summarize, and organize your inbox with AI assistance.',
    icon: Mail,
    color: 'from-sky-500 to-blue-600',
  },
  {
    title: 'Secure by Design',
    description: 'Encrypted storage. Private by default. Your data stays yours.',
    icon: Shield,
    color: 'from-slate-500 to-zinc-600',
  },
];

const USE_CASES = [
  {
    title: 'Upload Your Data',
    description: 'Add docs, work files, screenshots, or any data you want your AI to have access to.',
    icon: Upload,
    step: '1',
  },
  {
    title: 'Connect Your Apps',
    description: 'Link Gmail, Drive, and other platforms. Sync everything to one smart library.',
    icon: Link2,
    step: '2',
  },
  {
    title: 'Ask Anything',
    description: 'Your AI agent pulls info based on date, name, occasion — any reference you need.',
    icon: Sparkles,
    step: '3',
  },
];

const TARGET_USE_CASES = [
  {
    title: 'Busy Professionals',
    description: 'Never lose a contract, deadline, or important email again. Ask "What did the client agree to in March?" and get instant answers.',
    icon: Briefcase,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Business Owners',
    description: 'Track invoices, manage vendor contracts, and find that one receipt from 6 months ago — all in seconds.',
    icon: Receipt,
    color: 'from-green-500 to-emerald-600',
  },
  {
    title: 'Freelancers',
    description: 'Keep client proposals, project files, and payment records organized. Search by client name, project, or date.',
    icon: FolderOpen,
    color: 'from-purple-500 to-violet-600',
  },
  {
    title: 'Students & Researchers',
    description: 'Upload papers, notes, and references. Ask your AI to find key concepts, quotes, or citations instantly.',
    icon: GraduationCap,
    color: 'from-orange-500 to-amber-600',
  },
  {
    title: 'Legal Professionals',
    description: 'Search case files, contracts, and legal documents by clause, date, or party name. Never miss a filing deadline.',
    icon: Scale,
    color: 'from-slate-600 to-gray-700',
  },
  {
    title: 'Real Estate Agents',
    description: 'Manage property documents, client files, and closing paperwork. Pull up any detail during showings or negotiations.',
    icon: Home,
    color: 'from-teal-500 to-cyan-600',
  },
  {
    title: 'Healthcare Workers',
    description: 'Organize medical records, research papers, and compliance documents. Find patient protocols instantly.',
    icon: Stethoscope,
    color: 'from-red-500 to-rose-600',
  },
  {
    title: 'Parents & Families',
    description: 'Track medical records, school documents, insurance papers, and family schedules all in one place.',
    icon: Users,
    color: 'from-pink-500 to-rose-500',
  },
];

export const Features = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  return (
    <div className="relative pt-16 pb-10 px-5 flex flex-col items-center justify-center mt-auto">
      {/* Benefits Section */}
      <div className="w-full max-w-5xl mx-auto mb-16">
        <MotionEffect
          slide={{ direction: 'down' }}
          fade
          zoom
          inView
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-foreground mb-2">
            Everything your AI agent can do
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            Powerful capabilities that transform how you work with your data.
          </p>
        </MotionEffect>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <MotionEffect
                slide={{ direction: 'down' }}
                fade
                zoom
                inView
                delay={0.15 * index}
                key={index}
              >
                <motion.div
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                  }}
                  className="relative w-full bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-5 border border-border hover:border-primary/20 transition-colors"
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br',
                    feature.color
                  )}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <h3 className="text-base font-semibold text-foreground mb-1.5">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </MotionEffect>
            );
          })}
        </div>
      </div>

      {/* Use Cases / How It Works Section */}
      <div className="w-full max-w-5xl mx-auto mb-16">
        <MotionEffect
          slide={{ direction: 'down' }}
          fade
          zoom
          inView
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-foreground mb-2">
            How it works
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            Three simple steps to your personal AI agent.
          </p>
        </MotionEffect>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {USE_CASES.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <MotionEffect
                slide={{ direction: 'down' }}
                fade
                zoom
                inView
                delay={0.15 * index}
                key={index}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative w-full bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-border"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {useCase.step}
                    </div>
                    <Icon className="w-5 h-5 text-muted-foreground mt-1.5" />
                  </div>
                  
                  <h3 className="text-base font-semibold text-foreground mb-1.5">
                    {useCase.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {useCase.description}
                  </p>
                </motion.div>
              </MotionEffect>
            );
          })}
        </div>
      </div>

      {/* Target Use Cases Section */}
      <div className="w-full max-w-5xl mx-auto mb-16">
        <MotionEffect
          slide={{ direction: 'down' }}
          fade
          zoom
          inView
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-foreground mb-2">
            Use Cases
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            Whatever your role, Mini Doc adapts to your workflow and solves real problems.
          </p>
        </MotionEffect>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TARGET_USE_CASES.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <MotionEffect
                slide={{ direction: 'down' }}
                fade
                zoom
                inView
                delay={0.1 * index}
                key={index}
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="relative w-full bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-5 border border-border hover:border-primary/20 transition-colors"
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br',
                    useCase.color
                  )}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <h3 className="text-base font-semibold text-foreground mb-1.5">
                    {useCase.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {useCase.description}
                  </p>
                </motion.div>
              </MotionEffect>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-5xl mx-auto mb-16">
        <MotionEffect
          slide={{ direction: 'up' }}
          fade
          zoom
          inView
        >
          <div className="text-center">
            <motion.button
              onClick={() => onNavigate?.('signin')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-neutral-800 transition-colors text-lg"
            >
              Get Started Free
              <Sparkles className="w-5 h-5" />
            </motion.button>
          </div>
        </MotionEffect>
      </div>
    </div>
  );
};
