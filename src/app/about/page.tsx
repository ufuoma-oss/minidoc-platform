'use client';

import Link from 'next/link';
import { ArrowLeft, Brain, Database, Shield, Users, Sparkles } from 'lucide-react';
import { MiniDocLogo3D } from '@/components/minidoc/icons/CustomIcons';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <MiniDocLogo3D size={40} />
            <span className="text-2xl font-semibold font-logo">Mini Doc</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
            About Mini Doc
          </h1>
          <p className="text-lg text-muted-foreground">
            Your personal AI agent that turns your data into real work.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-neutral max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mini Doc was built to solve a simple but overwhelming problem: the chaos of modern digital life. 
              Documents scattered across drives, emails buried in inboxes, files lost in folders — all the 
              information you need, but none of it accessible when you need it.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We believe your data should work for you, not the other way around. Mini Doc transforms your 
              paperwork, emails, files, and screenshots into an intelligent AI agent that understands your 
              life and helps you get things done.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">What We Built</h2>
            <div className="grid gap-4">
              <div className="flex gap-4 p-4 rounded-xl bg-neutral-50 border border-border">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Smart Digital Library</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload any document, file, or screenshot. Connect Gmail, Drive, and more. 
                    Everything syncs to one unified AI-powered library.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-neutral-50 border border-border">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Reference-Based Retrieval</h3>
                  <p className="text-sm text-muted-foreground">
                    Ask for anything by date, name, occasion, or any reference point. 
                    Your AI agent finds exactly what you need from your digital library.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-neutral-50 border border-border">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-500 to-zinc-600 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Private by Design</h3>
                  <p className="text-sm text-muted-foreground">
                    Your data is encrypted, isolated, and never used to train public AI models. 
                    What&apos;s yours stays yours.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Who It&apos;s For</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mini Doc is for anyone who wants to stop drowning in digital clutter and start getting 
              real work done. Whether you&apos;re a busy professional managing contracts and emails, 
              a business owner tracking invoices and projects, or someone who just wants their personal 
              documents organized and accessible — Mini Doc is your 24/7 AI assistant.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Commitment</h2>
            <p className="text-muted-foreground leading-relaxed">
              We&apos;re committed to building technology that genuinely helps people. No gimmicks, 
              no unnecessary complexity — just a powerful AI agent that understands your data and 
              helps you use it. We prioritize your privacy, value your time, and believe the best 
              technology is the kind you don&apos;t have to think about.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
