
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectHeader } from "@/components/theia/ProjectHeader";
import { ProjectsTabContent } from "@/components/theia/ProjectsTabContent";
import { TemplatesTabContent } from "@/components/theia/TemplatesTabContent";

export default function TheiaProjects() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const projects = [
    {
      id: "p1",
      name: "Dashboard UI",
      description: "Frontend components for the Tiation Board dashboard",
      language: "TypeScript",
      lastUpdated: "2 hours ago",
      status: "In Progress"
    },
    {
      id: "p2",
      name: "API Integration",
      description: "REST API connection service for data integration",
      language: "TypeScript",
      lastUpdated: "Yesterday",
      status: "Active"
    },
    {
      id: "p3",
      name: "Database Models",
      description: "Data models and persistence layer",
      language: "JavaScript",
      lastUpdated: "3 days ago",
      status: "Active"
    },
    {
      id: "p4",
      name: "Documentation",
      description: "Project documentation and user guides",
      language: "Markdown",
      lastUpdated: "1 week ago",
      status: "Completed"
    }
  ];

  // Filter projects based on search query
  const filteredProjects = searchQuery
    ? projects.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <ProjectHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList>
              <TabsTrigger value="projects">All Projects</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects">
              <ProjectsTabContent projects={filteredProjects} />
            </TabsContent>
            
            <TabsContent value="recent">
              <ProjectsTabContent projects={projects.slice(0, 2)} />
            </TabsContent>
            
            <TabsContent value="templates">
              <TemplatesTabContent />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
