"use client";

import { motion } from "motion/react";
import { 
  Bot, 
  Folder, 
  Mail, 
  Shield, 
  Zap, 
  Cpu 
} from "lucide-react";

interface Benefit {
  title: string;
  description: string;
  icon: React.ElementType;
}

const benefits: Benefit[] = [
  {
    title: "Smart Document Analysis",
    description:
      "Upload any document and let AI extract key information, summarize content, and answer your questions.",
    icon: Bot,
  },
  {
    title: "App Integrations",
    description:
      "Connect Gmail, Google Drive, Outlook, and more. Access all your data from one unified interface.",
    icon: Folder,
  },
  {
    title: "Natural Conversations",
    description:
      "Just chat naturally with Mini Doc. No complex commands or learning curve required.",
    icon: Mail,
  },
  {
    title: "Secure & Private",
    description:
      "Your documents are encrypted end-to-end. We never use your data to train AI models.",
    icon: Shield,
  },
  {
    title: "Instant Responses",
    description:
      "Get immediate answers about your documents. No more searching through endless files.",
    icon: Zap,
  },
  {
    title: "Task Automation",
    description:
      "Let Mini Doc handle repetitive tasks like drafting emails, organizing files, and setting reminders.",
    icon: Cpu,
  },
];

export default function ProductBenefits() {
  return (
    <section id="features" className="relative w-full py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="h-full w-full opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="tracking-tighter text-balance text-4xl font-medium md:text-5xl lg:text-6xl text-foreground mb-4">
            Built to Make Your Life Easier
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Stop drowning in documents. Let AI handle the heavy lifting so you can focus on what matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-dashed border-l border-t border-muted-foreground/20">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 md:p-8 border-dashed border-r border-b border-muted-foreground/20 flex flex-col items-center text-center group relative overflow-hidden h-full min-h-[200px] sm:min-h-[250px] justify-center"
              >
                <div className="absolute inset-0 bg-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="mb-6 p-3.5 rounded-2xl group-hover:scale-110 transition-all duration-300 z-10">
                  <Icon className="w-8 h-8 text-foreground" size={32} />
                </div>

                <h3 className="text-xl font-medium mb-3 text-foreground transition-colors z-10">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-md z-10 max-w-[300px] sm:max-w-[320px]">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
