
import { Button } from "@/components/ui/button";
import { FolderGit } from "lucide-react";
import { ProjectSearch } from "./ProjectSearch";

interface ProjectHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ProjectHeader({ searchQuery, setSearchQuery }: ProjectHeaderProps) {
  return (
    <header>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Theia Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your development projects and workspaces</p>
        </div>
        <Button>
          <FolderGit className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      
      <ProjectSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </header>
  );
}
