import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import ProjectsHeaderSection from "@/components/projects/ProjectsHeaderSection";
import SearchAndFilterSection from "@/components/projects/SearchAndFilterSection";

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectsHeaderSection />
      <SearchAndFilterSection />
      <ProjectsGrid />
      {/* Add Project Button - Fixed */}
      <Link href="/projects/create-project">
        <Button
          className="fixed bottom-8 right-8 rounded-full shadow-lg"
          size="lg"
        >
          Upload Idea
        </Button>
      </Link>
    </div>
  );
}
