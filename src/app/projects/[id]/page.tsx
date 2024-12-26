import { Heart, MessageSquare, Users } from "lucide-react";

import { getProject } from "@/lib/services/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Params {
  id: string; // Next.js route params are always strings
}

interface PageProps {
  params: Params;
}

export default async function ProjectPage({ params }: PageProps) {
  const id = parseInt(params.id, 10); // Convert string to number
  const project = await getProject(id);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="mb-2 text-2xl">{project.title}</CardTitle>
              <div className="mb-4 flex gap-2">
                <Badge variant="outline">{project.category}</Badge>
                <Badge variant="outline">{project.status}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Users className="mr-1 h-4 w-4" />
                Join Project
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold">Description</h3>
              <p className="text-gray-600">{project.description}</p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">Skills Required</h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Heart className="mr-1 h-4 w-4" />
                  {project.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  {project.comments}
                </Button>
                <Button variant="ghost" size="sm">
                  <Users className="mr-1 h-4 w-4" />
                  {project.collaborators}
                </Button>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <span>Created by {project.owner.name}</span>
                <span className="mx-2">•</span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
