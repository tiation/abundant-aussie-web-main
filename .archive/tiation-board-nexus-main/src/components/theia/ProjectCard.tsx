
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCode } from "lucide-react";
import { Link } from "react-router-dom";

export interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    language: string;
    lastUpdated: string;
    status: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card key={project.id}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle>{project.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
          <Badge variant={
            project.status === "Completed" ? "default" :
            project.status === "In Progress" ? "secondary" :
            "outline"
          }>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm mb-4">
          <div className="flex items-center">
            <span className="inline-block h-3 w-3 rounded-full bg-primary mr-2" />
            <span>{project.language}</span>
          </div>
          <span className="text-muted-foreground">Updated {project.lastUpdated}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            View
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link to="/ide">
              <FileCode className="mr-2 h-4 w-4" />
              Open in IDE
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
