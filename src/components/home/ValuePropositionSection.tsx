import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Code, Lightbulb, Users } from "lucide-react";

const ValuePropositionSection = () => {
  return (
    <div className="bg-neutral-50/50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* First Row - Idea Holders */}
        <div className="mb-24 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 font-semibold text-yellow-600">
              <div className="rounded-lg bg-yellow-100 p-2">
                <Lightbulb className="h-5 w-5" />
              </div>
              <span>For Idea Holders</span>
            </div>
            <h2 className="text-3xl font-bold text-neutral-900">
              Turn Your Ideas into Reality with the Right Team
            </h2>
            <p className="text-lg text-neutral-600">
              Have a groundbreaking idea but need technical expertise? Connect
              with passionate developers who share your vision and can help
              bring your project to life. Our platform helps you find the
              perfect collaborators who are just as excited about your idea as
              you are.
            </p>
            <ul className="space-y-3">
              {[
                "Share your vision and get feedback from the community",
                "Find developers with the right skills and enthusiasm",
                "Build your dream team and start developing",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  </div>
                  <span className="text-neutral-700">{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link href="/projects/create-project">
                <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-3 font-semibold text-neutral-900 transition-opacity hover:opacity-90">
                  Share Your Idea
                </button>
              </Link>
            </div>
          </div>
          <div className="lg:ml-12">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-100 via-amber-50 to-neutral-100 p-1">
                <div className="relative h-full overflow-hidden rounded-xl">
                  <Image
                    src="/ideation.svg"
                    alt="Ideation and collaboration"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-yellow-400 opacity-20 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-orange-400 opacity-20 blur-2xl" />
            </div>
          </div>
        </div>

        {/* Second Row - Developers */}
        <div className="mb-24 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6 lg:order-2">
            <div className="inline-flex items-center gap-2 font-semibold text-blue-600">
              <div className="rounded-lg bg-blue-100 p-2">
                <Code className="h-5 w-5" />
              </div>
              <span>For Developers</span>
            </div>
            <h2 className="text-3xl font-bold text-neutral-900">
              Level Up Your Skills with Exciting Side Projects
            </h2>
            <p className="text-lg text-neutral-600">
              Looking for meaningful projects to contribute to in your free
              time? Join interesting projects that align with your skills and
              learning goals. Work with other developers, expand your portfolio,
              and grow your expertise while building something meaningful.
            </p>
            <ul className="space-y-3">
              {[
                "Find projects that match your tech stack and interests",
                "Collaborate with other passionate developers",
                "Build your portfolio with impactful projects",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="text-neutral-700">{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link href="/projects">
                <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-sky-500 px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90">
                  Find Projects
                </button>
              </Link>
            </div>
          </div>
          <div className="lg:order-1 lg:mr-12">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 via-sky-50 to-neutral-100 p-1">
                <div className="relative h-full overflow-hidden rounded-xl">
                  <Image
                    src="/developer.svg"
                    alt="Developer collaboration"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-400 opacity-20 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-sky-400 opacity-20 blur-2xl" />
            </div>
          </div>
        </div>

        {/* Third Row - Community & Fun */}
        <div className="relative">
          <div className="absolute inset-0">
            <div className="absolute -top-4 right-1/4 h-32 w-32 rounded-full bg-violet-400 opacity-20 blur-2xl" />
            <div className="absolute -bottom-4 left-1/4 h-32 w-32 rounded-full bg-purple-400 opacity-20 blur-2xl" />
          </div>
          <div className="relative mx-auto max-w-3xl space-y-6 px-4 text-center">
            <div className="inline-flex items-center gap-2 font-semibold text-violet-600">
              <div className="rounded-lg bg-violet-100 p-2">
                <Users className="h-5 w-5" />
              </div>
              <span>For Everyone</span>
            </div>
            <h2 className="text-4xl font-bold text-neutral-900">
              Coding is Better Together
            </h2>
            <p className="text-xl text-neutral-600">
              Who said coding can&apos;t be fun? Join a vibrant community of
              developers who believe in making coding an enjoyable journey.
              Share experiences, learn together, and build lasting connections
              while working on exciting projects.
            </p>
            <ul className="mx-auto max-w-xl space-y-3 text-left">
              {[
                "Connect with developers who share your interests",
                "Learn and grow in a supportive environment",
                "Turn coding sessions into fun collaborative adventures",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-violet-100">
                    <div className="h-2 w-2 rounded-full bg-violet-500"></div>
                  </div>
                  <span className="text-neutral-700">{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-6">
              <Link href="/community">
                <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 px-8 py-4 text-lg font-semibold text-white transition-opacity hover:opacity-90">
                  Join the Community
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuePropositionSection;
