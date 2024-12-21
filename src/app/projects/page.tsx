import React from "react";
import { Github, Heart, MessageSquare, Users } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample project data
const projects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A modern e-commerce platform built with Next.js and Stripe",
    category: "Web Development",
    skills: ["React", "Node.js", "TypeScript"],
    owner: "Sarah Chen",
    likes: 45,
    comments: 12,
    collaborators: 3,
    status: "Active",
  },
  {
    id: 2,
    title: "AI Image Generator",
    description: "Generate unique images using machine learning algorithms",
    category: "AI/ML",
    skills: ["Python", "TensorFlow", "AWS"],
    owner: "Michael Brown",
    likes: 89,
    comments: 34,
    collaborators: 5,
    status: "Active",
  },
  // Add more sample projects...
];

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Discover Projects</h1>
        <p className="text-lg text-muted-foreground">
          Find exciting projects to collaborate on or share your own ideas
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <Input placeholder="Search projects..." className="w-full" />
        </div>
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="web">Web Development</SelectItem>
              <SelectItem value="mobile">Mobile Apps</SelectItem>
              <SelectItem value="ai">AI/ML</SelectItem>
              <SelectItem value="blockchain">Blockchain</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="active">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="mb-2">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <Badge
                  variant={
                    project.status === "Active" ? "default" : "secondary"
                  }
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
                Created by {project.owner}
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
              <Button variant="outline" size="sm">
                <Github className="mr-2 h-4 w-4" />
                View Project
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Project Button - Fixed */}
      <Button
        className="fixed bottom-8 right-8 rounded-full shadow-lg"
        size="lg"
      >
        Upload Project
      </Button>
    </div>
  );
}
