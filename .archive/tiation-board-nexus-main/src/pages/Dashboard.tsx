
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { ProjectCard } from "@/components/ProjectCard";
import { VersionControl } from "@/components/VersionControl";
import { TheiaIDE } from "@/components/TheiaIDE";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const projects = [
  {
    id: "1",
    name: "Dashboard Redesign",
    description: "Revamping the NGO dashboard interface",
    progress: 75,
    lastUpdated: "2 hours ago",
    status: "active" as const,
    commits: 47,
    branches: 3,
    forks: 2
  },
  {
    id: "2",
    name: "API Integration",
    description: "Connect to external data sources",
    progress: 45,
    lastUpdated: "Yesterday",
    status: "active" as const,
    commits: 31,
    branches: 2,
    forks: 1
  },
  {
    id: "3",
    name: "Documentation Site",
    description: "User guides and developer docs",
    progress: 90,
    lastUpdated: "5 days ago",
    status: "completed" as const,
    commits: 24,
    branches: 1,
    forks: 0
  },
  {
    id: "4",
    name: "Database Migration",
    description: "Upgrade to latest database version",
    progress: 30,
    lastUpdated: "1 week ago",
    status: "on-hold" as const,
    commits: 12,
    branches: 1,
    forks: 0
  }
];

const stats = [
  { name: "Total Projects", value: "12" },
  { name: "Active Projects", value: "7" },
  { name: "Team Members", value: "9" },
  { name: "Code Commits", value: "1,283" },
];

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <header>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground mt-1">Here's an overview of your Tiation board development projects</p>
          </header>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="version-control">Version Control</TabsTrigger>
              <TabsTrigger value="ide">Theia IDE</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="version-control">
              <VersionControl />
            </TabsContent>
            
            <TabsContent value="ide">
              <TheiaIDE />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
