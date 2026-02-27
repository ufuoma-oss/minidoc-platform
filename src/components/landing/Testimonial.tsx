"use client";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";

const reviews = [
  {
    name: "Sarah Chen",
    bio: "Product Manager",
    body: "Mini Doc has completely transformed how I manage my documents. The AI understands context perfectly!",
    img: "https://pbs.twimg.com/profile_images/1902211854476439552/CTVSPPo1_400x400.jpg",
  },
  {
    name: "Michael Torres",
    bio: "Startup Founder",
    body: "Finally, an AI assistant that actually helps me stay organized. The Gmail integration is a game changer.",
    img: "https://pbs.twimg.com/profile_images/1972611039066791936/cwvQHJ0S_400x400.jpg",
  },
  {
    name: "Emily Watson",
    bio: "Freelance Designer",
    body: "I used to lose track of important documents all the time. Mini Doc keeps everything organized and accessible.",
    img: "https://pbs.twimg.com/profile_images/1179462746414432257/HBkrOkaX_400x400.jpg",
  },
  {
    name: "David Kim",
    bio: "Software Engineer",
    body: "The chat interface is so intuitive. I can just ask questions about my documents and get instant answers.",
    img: "https://pbs.twimg.com/profile_images/1754514553503887360/sFqjE3AQ_400x400.jpg",
  },
  {
    name: "Lisa Johnson",
    bio: "Marketing Director",
    body: "Mini Doc helps me stay on top of all my contracts and agreements. The AI summaries are incredibly accurate.",
    img: "https://pbs.twimg.com/profile_images/1649670410848333825/yNqgk-ys_400x400.jpg",
  },
  {
    name: "James Wilson",
    bio: "Real Estate Agent",
    body: "Managing property documents has never been easier. This tool saves me hours every week.",
    img: "https://pbs.twimg.com/profile_images/1965065977436991488/f9FD6oer_400x400.jpg",
  },
  {
    name: "Anna Martinez",
    bio: "Healthcare Admin",
    body: "Finally a document manager that respects privacy while still being useful. Highly recommended!",
    img: "https://pbs.twimg.com/profile_images/1996490150264889344/KA5Wr5i3_400x400.jpg",
  },
  {
    name: "Robert Lee",
    bio: "Financial Advisor",
    body: "The app integrations are seamless. I can access all my client documents from one place.",
    img: "https://pbs.twimg.com/profile_images/1451865652457717764/xpBuUbkB_400x400.jpg",
  },
  {
    name: "Jennifer Brown",
    bio: "Legal Consultant",
    body: "Mini Doc understands legal jargon perfectly. It&apos;s like having a paralegal assistant 24/7.",
    img: "https://pbs.twimg.com/profile_images/2006752020804354048/0w4PqgY9_400x400.jpg",
  },
  {
    name: "Chris Anderson",
    bio: "Content Creator",
    body: "The AI helps me find relevant information across all my files instantly. Such a time saver!",
    img: "https://pbs.twimg.com/profile_images/1924504051728670720/mqyGd02m_400x400.jpg",
  },
  {
    name: "Michelle Davis",
    bio: "HR Manager",
    body: "Managing employee documents is now a breeze. The search functionality is incredibly powerful.",
    img: "https://pbs.twimg.com/profile_images/1847198803218071552/Y5ih3vmW_400x400.jpg",
  },
  {
    name: "Thomas Wright",
    bio: "Researcher",
    body: "For anyone dealing with lots of documents, this is a must-have tool. The AI is remarkably accurate.",
    img: "https://pbs.twimg.com/profile_images/2002983266513780736/gwRnmlXg_400x400.jpg",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  bio,
  body,
}: {
  img: string;
  name: string;
  bio: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-72 sm:w-[350px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border p-4 sm:p-6 transition-all duration-300",
        "border-border bg-background/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/10 hover:shadow-md group"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-full ring-1 ring-border group-hover:ring-primary/20 transition-all">
          <Image
            className="object-cover"
            fill
            sizes="(max-width: 640px) 36px, 40px"
            alt={name}
            src={img}
          />
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-foreground tracking-tight">
            {name}
          </figcaption>
          <p className="text-xs sm:text-sm font-normal text-muted-foreground/80">
            {bio}
          </p>
        </div>
      </div>
      <blockquote className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-foreground/80 group-hover:text-foreground transition-colors whitespace-pre-wrap">
        {body}
      </blockquote>
    </figure>
  );
};

export function Testimonial() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section id="testimonials" className="w-full py-24 px-4 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto items-center justify-center flex flex-col">
        <div className="mb-12 sm:mb-20 text-center">
          <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Wall of{" "}
            <motion.span
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="relative cursor-default inline-flex items-center gap-2 px-4 py-1 rounded-2xl bg-primary/5 border border-primary/10 text-primary hover:bg-primary/10 hover:border-primary/20 transition-colors duration-300"
            >
              Love
              <motion.span
                animate={
                  isHovered
                    ? {
                        scale: [1, 1.1, 1],
                      }
                    : { scale: 1 }
                }
                transition={{
                  duration: 0.7,
                  repeat: isHovered ? Infinity : 0,
                  ease: "easeInOut",
                }}
                className="inline-block"
              >
                💖
              </motion.span>
            </motion.span>
          </h2>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:40s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.name + review.bio} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:40s] mt-4">
            {secondRow.map((review) => (
              <ReviewCard key={review.name + review.bio} {...review} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
