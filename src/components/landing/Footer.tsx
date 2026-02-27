"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

interface FooterProps {
  onNavigate: (page: string) => void;
}

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" },
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Careers", href: "#careers" },
  ],
  legal: [
    { name: "Privacy", href: "#privacy" },
    { name: "Terms", href: "#terms" },
  ],
};

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-background border-t border-border/40">
      <div className="relative overflow-hidden py-28 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight text-foreground mb-10">
            Your personal AI assistant <br />
            <span className="text-muted-foreground">for documents is here</span>
          </h2>

          <Button
            size="lg"
            className="rounded-full px-10 h-14 text-lg gap-2 group shadow-xl shadow-primary/10 cursor-pointer"
            onClick={() => onNavigate("signin")}
          >
            Get Started Free
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-24 border-t border-border/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-6 space-y-6">
            <button
              onClick={() => onNavigate("landing")}
              className="block"
            >
              <span className="text-xl font-bold tracking-tight text-zinc-900">
                Mini Doc
              </span>
            </button>
            <p className="text-muted-foreground text-lg lg:text-lg md:text-xl max-w-sm leading-relaxed">
              AI-powered document management. <br />
              Connect your apps, chat with your data.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
                Product
              </h4>
              <ul className="space-y-4">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-base text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
                Company
              </h4>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-base text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
                Legal
              </h4>
              <ul className="space-y-4">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-base text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-10 border-t border-border/40 flex flex-row items-center justify-between gap-4">
          <div className="flex items-center text-sm sm:text-base text-muted-foreground transition-colors whitespace-nowrap">
            <span>&copy; {new Date().getFullYear()} Mini Doc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-muted-foreground transition-colors whitespace-nowrap">
            <span className="xs:inline">Made with</span>
            <span className="text-red-500">❤️</span>
            <span className="xs:inline">for productivity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
