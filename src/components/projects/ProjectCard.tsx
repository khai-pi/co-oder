"use client";

// src/components/projects/ProjectCard.tsx
import Link from "next/link";
import { Heart, MessageSquare, Users } from "lucide-react";

import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="mb-2">{project.title}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </div>
          <Badge
            variant={project.status === "Active" ? "default" : "secondary"}
          >
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-4 flex flex-wrap gap-2">
          {project.skills.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          Created by {project.owner.username}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" className="flex gap-1">
            <Heart className="h-4 w-4" />
            {project.likes}
          </Button>
          <Button variant="ghost" size="sm" className="flex gap-1">
            <MessageSquare className="h-4 w-4" />
            {project.comments}
          </Button>
          <Button variant="ghost" size="sm" className="flex gap-1">
            <Users className="h-4 w-4" />
            {project.collaborators}
          </Button>
        </div>
        <Link href={`/projects/${project.id}`}>
          <Button variant="outline" size="sm">
            View Project
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
