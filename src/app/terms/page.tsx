'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MiniDocLogo3D } from '@/components/minidoc/icons/CustomIcons';

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: February 24, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-neutral max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Mini Doc (&quot;Service&quot;), you agree to be bound by these Terms of Service 
              (&quot;Terms&quot;). If you do not agree to these Terms, do not use our Service. These Terms constitute 
              a legally binding agreement between you and Mini Doc.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mini Doc provides an AI-powered personal agent service that allows you to upload documents, 
              connect external services (such as Gmail, Google Drive, Outlook), and interact with your data 
              through natural language queries. Your AI agent can retrieve information based on dates, names, 
              occasions, and other references from your digital library.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Account Registration</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To use our Service, you must:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Be at least 18 years old</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You agree to use the Service only for lawful purposes. You may not:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Upload, store, or process illegal content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Attempt to compromise the security of our systems</li>
              <li>Use the Service to harass, harm, or discriminate against others</li>
              <li>Reverse engineer or attempt to extract our AI models or algorithms</li>
              <li>Resell or redistribute the Service without authorization</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Your Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              You retain full ownership of all documents, files, and data you upload or connect to the Service. 
              By using the Service, you grant Mini Doc a limited license to process your content solely for 
              the purpose of providing the Service to you. This includes indexing, analyzing, and retrieving 
              your data through your AI agent.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              You are responsible for ensuring you have the right to upload and process any content you 
              submit to the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">AI-Generated Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              The AI agent may generate summaries, insights, and other content based on your data. 
              You retain ownership of outputs derived from your content. The AI does not send emails 
              or take actions on your behalf without your explicit confirmation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Subscriptions and Payments</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our Service is offered through paid subscriptions:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>All subscriptions are billed in advance</li>
              <li>You may cancel at any time; access continues until the end of your billing period</li>
              <li>Prices may change with 30 days&apos; notice for existing subscribers</li>
              <li>Trial periods may be offered at our discretion</li>
              <li>Refunds are provided at our sole discretion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your use of the Service is also governed by our Privacy Policy, which is incorporated 
              into these Terms by reference. Key points include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>Your personal documents are not used to train public AI models</li>
              <li>All data is encrypted and isolated to your account</li>
              <li>You can delete your data at any time</li>
              <li>Connected services can be disconnected at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mini Doc and its original content, features, and functionality are owned by us and are 
              protected by international copyright, trademark, and other intellectual property laws. 
              Our trademarks may not be used without prior written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Service Modifications</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify, suspend, or discontinue the Service at any time. 
              We will provide reasonable notice of any material changes that negatively affect your 
              use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice, for any 
              reason, including breach of these Terms. Upon termination, your right to use the Service 
              ceases immediately, and we may delete your account and all associated data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, 
              WHETHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, 
              ERROR-FREE, OR SECURE. AI-GENERATED CONTENT MAY NOT BE ACCURATE AND SHOULD BE VERIFIED.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, MINI DOC SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, 
              OR USE, WHETHER IN CONTRACT, TORT, OR OTHERWISE. OUR TOTAL LIABILITY SHALL NOT EXCEED 
              THE AMOUNT YOU PAID IN THE 12 MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify and hold harmless Mini Doc and its affiliates from any claims, 
              damages, losses, or expenses arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable laws, 
              without regard to conflict of law principles. Any disputes shall be resolved in the 
              courts of the applicable jurisdiction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may revise these Terms from time to time. We will notify you of any material changes 
              by posting the updated Terms on this page. Your continued use of the Service after such 
              changes constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about these Terms, please contact us through the Help & Support 
              section in your dashboard.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">
              About Us
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
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
