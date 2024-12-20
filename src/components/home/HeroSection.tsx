import React from 'react';
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="relative w-full">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" />

      {/* Main content */}
      <div className="relative mx-auto max-w-5xl px-4 pt-32 pb-36">
        {/* Small label on top */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Launching v0.1 — Read the announcement
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-center font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
          The Platform for Connecting 
          <br />
          Developers and Ideas
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-center text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8">
          Co-oder helps you connecting between business ideal and developer experience
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
          <Link href="/projects">
            <Button className="h-12 px-6 font-medium rounded-full" size="lg">
              Find a Project to Join
            </Button>
          </Link>
          <Link href="/projects/new">
            <Button className="h-12 px-6 font-medium rounded-full" size="lg">
              Upload your Project Idea
            </Button>
          </Link>
          <Link href="https://github.com/khai-pi/co-oder" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="h-12 px-6 font-medium rounded-full" size="lg">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </Link>
        </div>

        {/* Background dots pattern */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, currentColor 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;