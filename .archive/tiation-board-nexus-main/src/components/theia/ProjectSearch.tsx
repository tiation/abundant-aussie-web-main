
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProjectSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ProjectSearch({ searchQuery, setSearchQuery }: ProjectSearchProps) {
  return (
    <div className="mt-4 relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search projects..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
