'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "What is Mini Doc's AI agent?",
    answer: "Mini Doc's AI agent is your personal assistant that understands your data. Upload documents, files, and screenshots, connect your Gmail and other services, and the AI organizes everything into one smart digital library. Ask it anything and it pulls information by date, name, occasion, or any reference you need."
  },
  {
    question: "Is my data private and secure?",
    answer: "Absolutely. Your personal documents and emails are never used to train public AI models. All data is encrypted and isolated to your account. What's yours stays yours — we prioritize your privacy above everything else."
  },
  {
    question: "What can I upload to my smart library?",
    answer: "Upload anything: documents from work, PDFs, screenshots, photos, receipts, contracts, invoices, personal notes, and more. Connect Gmail, Drive, Outlook, and other services to sync everything into one unified AI-powered library."
  },
  {
    question: "How does reference-based retrieval work?",
    answer: "Simply ask your AI agent by reference. For example: 'Find the contract from last March', 'What did John send me about the project?', or 'Show me emails about the vacation planning'. The AI understands context and finds exactly what you need."
  },
  {
    question: "Which apps can I connect?",
    answer: "Mini Doc connects with Gmail, Google Drive, Outlook, Google Calendar, and more. Access your AI agent from iMessage, Telegram, or WhatsApp. New integrations are added regularly, and you can request specific ones from your dashboard."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, there are no long-term contracts. Cancel instantly from your dashboard settings, and you'll retain access until the end of your billing cycle."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-4 bg-[#EAE9E5] relative border-t border-gray-200/50 font-serif">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 mb-4 tracking-tight">
            Common Questions
          </h2>
          <p className="text-gray-600 text-lg font-serif">
            Everything you need to know about Mini Doc.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border rounded-2xl transition-all duration-300 ${openIndex === index ? 'bg-white border-gray-200 shadow-md' : 'bg-[#F2F1ED] border-transparent hover:bg-white hover:border-gray-200'}`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className={`text-lg font-serif font-medium ${openIndex === index ? 'text-gray-900' : 'text-gray-800'}`}>
                  {faq.question}
                </span>
                <span className={`p-2 rounded-full transition-colors ${openIndex === index ? 'bg-orange-50 text-[#FF5A36]' : 'text-gray-400'}`}>
                  {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 pt-0 text-gray-600 leading-relaxed font-medium font-serif">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
