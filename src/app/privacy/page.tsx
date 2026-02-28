'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MiniDocLogo3D } from '@/components/minidoc/icons/CustomIcons';

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: February 24, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-neutral max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mini Doc (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our AI-powered document management and personal agent services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We collect information that you provide directly to us and information that is collected 
              automatically when you use our services:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Documents and Files:</strong> PDFs, images, screenshots, and other files you upload to your digital library</li>
              <li><strong>Connected Data:</strong> Emails, calendar events, and files from integrated services like Gmail, Google Drive, and Outlook</li>
              <li><strong>Account Information:</strong> Name, email address, and payment information</li>
              <li><strong>Usage Data:</strong> How you interact with our services, including queries to your AI agent</li>
              <li><strong>Device Information:</strong> Browser type, IP address, and device identifiers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use your information to provide and improve our services:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Power your personal AI agent to understand and retrieve your data</li>
              <li>Sync and organize documents across your connected platforms</li>
              <li>Enable reference-based retrieval by date, name, occasion, or context</li>
              <li>Process your requests and provide customer support</li>
              <li>Improve our AI capabilities and service quality</li>
              <li>Protect against fraud and unauthorized access</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Data Security and AI Processing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Your privacy is foundational to how we operate:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard encryption protocols</li>
              <li><strong>Isolation:</strong> Your documents and data are strictly isolated to your account</li>
              <li><strong>AI Training:</strong> Your personal documents and emails are <strong>never</strong> used to train public AI models</li>
              <li><strong>Access Control:</strong> Only you and your AI agent can access your data</li>
              <li><strong>Secure Infrastructure:</strong> We use enterprise-grade security measures to protect your information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Connected Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you connect services like Gmail, Google Drive, or Outlook, we access only the data 
              necessary to provide our services. We do not share your connected data with third parties. 
              You can disconnect any service at any time from your account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Data Retention and Deletion</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data remains in your account as long as you use our services. You can delete individual 
              documents or your entire account at any time. Upon account deletion, all your data is 
              permanently removed from our systems within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access and download your data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and all associated data</li>
              <li>Disconnect integrated services</li>
              <li>Opt out of non-essential communications</li>
              <li>Restrict processing of your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may use third-party services for payment processing, analytics, and infrastructure. 
              These providers are bound by strict data protection agreements and do not use your 
              personal documents for their own purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Children&apos;s Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mini Doc is not intended for users under 18 years of age. We do not knowingly collect 
              personal information from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us 
              through the Help & Support section in your dashboard.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">
              About Us
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
