import React from "react";
import Link from "next/link";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const colors = [
  'from-blue-500 to-purple-500',
  'from-yellow-400 to-orange-500',
  'from-green-400 to-emerald-500',
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-blue-500',
  'from-violet-500 to-purple-500',
  'from-orange-400 to-red-500',
  'from-teal-400 to-cyan-500',
  'from-red-500 to-pink-500',
  'from-cyan-500 to-blue-500'
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const ColorWord: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Each word gets a random gradient that doesn't change
  const gradient = getRandomColor();
  return (
    <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent inline-block`}>
      {children}
    </span>
  );
};

interface GradientButtonProps {
  children: React.ReactNode;
  href: string;
  isOutline?: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({ children, href, isOutline = false }) => {
  if (isOutline) {
    return (
      <Link href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
        <Button
          variant="outline"
          className="h-12 rounded-full px-6 font-medium bg-white/80 backdrop-blur-sm hover:bg-white/90"
          size="lg"
        >
          {children}
        </Button>
      </Link>
    );
  }

  const gradient = getRandomColor();
  return (
    <Link href={href}>
      <Button
        className={`h-12 rounded-full px-6 font-medium bg-gradient-to-r ${gradient} border-none hover:opacity-90`}
        size="lg"
      >
        {children}
      </Button>
    </Link>
  );
};

const HeroSection = () => {
  const headingWords = ['The', 'Platform', 'for', 'Connecting', 'Developers', 'and', 'Ideas'];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative mx-auto max-w-5xl px-4 pb-36 pt-32">
        {/* Small label on top */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm px-3 py-1 text-sm">
            <ColorWord>
              Launching v0.1 — Read the announcement
            </ColorWord>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="mb-6 text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl space-x-3">
          {headingWords.map((word, index) => (
            <React.Fragment key={index}>
              <ColorWord>{word}</ColorWord>
              {index === 3 && <br />}
            </React.Fragment>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-8 max-w-2xl text-center text-lg text-slate-600 dark:text-slate-400 sm:text-xl">
          Co-oder helps you connecting between business ideas and developer
          experience
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <GradientButton href="/projects">
            Find a Project to Join
          </GradientButton>
          <GradientButton href="/projects/create-project">
            Upload your Project Idea
          </GradientButton>
          <GradientButton href="https://github.com/khai-pi/co-oder" isOutline>
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </GradientButton>
        </div>

        {/* Background dots pattern */}
        {/* <div className="absolute inset-0 -z-10 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, currentColor 2px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div> */}
      </div>
    </div>
  );
};

export default HeroSection;