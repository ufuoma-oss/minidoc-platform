'use client';

import React from 'react';
import { ArrowLeft, Shield, Lock, Database } from 'lucide-react';

interface PrivacyPolicyProps {
  onNavigate: (page: string) => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#EAE9E5] font-serif text-gray-900 relative">
      <div className="sticky top-0 z-20 bg-[#EAE9E5]/90 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="group flex items-center text-sm font-bold text-gray-500 hover:text-[#FF5A36] transition-colors font-sans">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <span className="text-sm font-bold text-gray-400 font-sans">Privacy Policy</span>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 mb-6 tracking-tight">Privacy Policy</h1>
          <p className="text-gray-500 text-sm font-medium font-sans">Last updated: Dec 25, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-12 font-serif">
          <section>
            <p className="text-lg text-gray-800 font-medium">
              At Mini Doc, we value your privacy above all else. We understand that you trust us with your personal documents, emails, and appointments. This policy outlines exactly how we handle that data—transparently and simply.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4">
                <Lock size={20} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 font-serif">Your Data is Yours</h3>
              <p className="text-sm text-gray-500 font-serif">We do not sell your personal data to advertisers or third parties.</p>
            </div>
            <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Database size={20} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 font-serif">No Public AI Training</h3>
              <p className="text-sm text-gray-500 font-serif">Your documents are <span className="font-bold text-gray-700">not</span> used to train our public AI models.</p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-serif font-medium text-gray-900 mb-4">1. Information We Collect</h3>
            <p>We collect information to provide and improve our services to you:</p>
            <ul className="list-disc pl-5 space-y-2 mt-4 marker:text-[#FF5A36]">
              <li><strong>Account Information:</strong> Name, email address, and password when you create an account.</li>
              <li><strong>User Content:</strong> Documents, letters, emails, and files you upload for analysis.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our features.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-serif font-medium text-gray-900 mb-4">2. How We Use Your Information</h3>
            <p>Your data is processed primarily to fulfill the services you ask for:</p>
            <ul className="list-disc pl-5 space-y-2 mt-4 marker:text-[#FF5A36]">
              <li>To analyze documents and extract relevant details.</li>
              <li>To draft responses or new documents based on your prompts.</li>
              <li>To authenticate your identity and prevent fraud.</li>
              <li>To process payments for subscription services.</li>
            </ul>
          </section>

          <section className="bg-indigo-50/50 p-8 rounded-2xl border border-indigo-100">
            <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2 font-serif">
              <Shield size={20} /> 3. AI & Data Privacy
            </h3>
            <p className="text-indigo-900/80 mb-4">This is the part most users care about. Here is our promise:</p>
            <ul className="list-disc pl-5 space-y-2 marker:text-indigo-500 text-indigo-900/80">
              <li><strong>Isolation:</strong> Documents are processed within a secure environment restricted to your user context.</li>
              <li><strong>No Training on Personal Data:</strong> We do not use your private uploads to train LLMs for other customers.</li>
              <li><strong>Data Retention:</strong> You can delete your documents and chat history at any time.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-serif font-medium text-gray-900 mb-4">4. Contact Us</h3>
            <p>If you have questions about your privacy, please reach out:</p>
            <p className="mt-4 font-bold text-[#FF5A36] font-sans">privacy@minidoc.app</p>
          </section>
        </div>
      </main>

      <footer className="py-12 border-t border-gray-200/50 mt-12 text-center">
        <p className="text-sm text-gray-400 font-sans">© 2026 Mini Doc. Secure by design.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
