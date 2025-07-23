
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GitBranch, GitFork, GitCommitHorizontal } from "lucide-react";

type ProjectCardProps = {
  project: {
    id: string;
    name: string;
    description: string;
    progress: number;
    lastUpdated: string;
    status: "active" | "completed" | "on-hold";
    commits: number;
    branches: number;
    forks: number;
  };
};

export function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "completed": return "bg-blue-500";
      case "on-hold": return "bg-amber-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="dashboard-card overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold">{project.name}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {project.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className="capitalize">
            <span className={`w-2 h-2 rounded-full mr-1.5 ${getStatusColor(project.status)}`} />
            {project.status.replace("-", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
          <div className="pt-2 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <GitCommitHorizontal className="h-4 w-4" />
                <span>{project.commits}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitBranch className="h-4 w-4" />
                <span>{project.branches}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="h-4 w-4" />
                <span>{project.forks}</span>
              </div>
            </div>
            <span>Updated {project.lastUpdated}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button size="sm" variant="outline">View Details</Button>
        <Button size="sm" variant="secondary">Open in IDE</Button>
      </CardFooter>
    </Card>
  );
}
