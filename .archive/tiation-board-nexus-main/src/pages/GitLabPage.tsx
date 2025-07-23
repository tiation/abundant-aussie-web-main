
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  GitBranch, 
  GitPullRequest, 
  GitMerge, 
  GitCommitHorizontal,
  AlertCircle,
  Code,
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock GitLab data
const projects = [
  {
    id: 1,
    name: "dashboard-redesign",
    description: "Redesigning the NGO dashboard interface",
    stars: 5,
    forks: 2,
    lastCommit: "2 hours ago",
    visibility: "private"
  },
  {
    id: 2,
    name: "api-service",
    description: "RESTful API for the Tiation board portal",
    stars: 7,
    forks: 3,
    lastCommit: "1 day ago",
    visibility: "private"
  },
  {
    id: 3,
    name: "documentation",
    description: "User and developer documentation",
    stars: 3,
    forks: 1,
    lastCommit: "5 days ago",
    visibility: "public"
  }
];

const issues = [
  {
    id: 1,
    title: "Fix authentication timeout issue",
    author: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    project: "api-service",
    status: "open",
    priority: "high",
    assigned: "John Doe",
    created: "2 days ago"
  },
  {
    id: 2,
    title: "Add dark mode support",
    author: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    project: "dashboard-redesign",
    status: "open",
    priority: "medium",
    assigned: "Developer User",
    created: "3 days ago"
  },
  {
    id: 3,
    title: "Update API documentation",
    author: "Alex Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    project: "documentation",
    status: "closed",
    priority: "low",
    assigned: "Jane Smith",
    created: "1 week ago"
  }
];

const mergeRequests = [
  {
    id: 1,
    title: "Implement user authentication flow",
    author: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    project: "api-service",
    sourceBranch: "feature/auth",
    targetBranch: "main",
    status: "open",
    created: "1 day ago"
  },
  {
    id: 2,
    title: "Dashboard UI improvements",
    author: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    project: "dashboard-redesign",
    sourceBranch: "feature/ui-improvements",
    targetBranch: "develop",
    status: "reviewing",
    created: "2 days ago"
  },
  {
    id: 3,
    title: "Fix typos in documentation",
    author: "Alex Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    project: "documentation",
    sourceBranch: "fix/typos",
    targetBranch: "main",
    status: "merged",
    created: "3 days ago"
  }
];

export default function GitLabPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <header>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">GitLab Integration</h1>
                <p className="text-muted-foreground mt-1">Manage your code repositories, issues, and merge requests</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <GitBranch className="h-4 w-4 mr-2" />
                  New Branch
                </Button>
                <Button>
                  <Code className="h-4 w-4 mr-2" />
                  New Repository
                </Button>
              </div>
            </div>

            <div className="mt-4 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search projects, issues, or merge requests..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </header>

          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="merge-requests">Merge Requests</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span className="text-lg">{project.name}</span>
                        <Badge variant={project.visibility === 'private' ? 'outline' : 'default'}>
                          {project.visibility}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <GitCommitHorizontal className="h-4 w-4 mr-1" />
                          <span>Last commit: {project.lastCommit}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span>⭐ {project.stars}</span>
                          <span>🔀 {project.forks}</span>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm">View Project</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="issues">
              <Card>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>Issues</CardTitle>
                    <Button size="sm">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      New Issue
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {issues.map((issue) => (
                        <div 
                          key={issue.id} 
                          className="border rounded-md p-4 hover:bg-accent transition-colors"
                        >
                          <div className="flex justify-between">
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  issue.priority === 'high' ? 'bg-destructive' :
                                  issue.priority === 'medium' ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                              />
                              <h3 className="font-medium">{issue.title}</h3>
                            </div>
                            <Badge
                              variant={issue.status === 'open' ? 'outline' : 'secondary'}
                            >
                              {issue.status}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <div>Project: <span className="font-medium">{issue.project}</span></div>
                            <div className="flex justify-between mt-1">
                              <div>Created {issue.created} by {issue.author}</div>
                              <div>Assigned to {issue.assigned}</div>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-between items-center">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={issue.avatar} />
                              <AvatarFallback>{issue.author[0]}</AvatarFallback>
                            </Avatar>
                            <Button variant="ghost" size="sm">View Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="merge-requests">
              <Card>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>Merge Requests</CardTitle>
                    <Button size="sm">
                      <GitPullRequest className="h-4 w-4 mr-2" />
                      New MR
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {mergeRequests.map((mr) => (
                        <div 
                          key={mr.id} 
                          className="border rounded-md p-4 hover:bg-accent transition-colors"
                        >
                          <div className="flex justify-between">
                            <h3 className="font-medium">{mr.title}</h3>
                            <Badge
                              variant={
                                mr.status === 'open' ? 'outline' :
                                mr.status === 'reviewing' ? 'secondary' :
                                'default'
                              }
                            >
                              {mr.status}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <div>Project: <span className="font-medium">{mr.project}</span></div>
                            <div className="mt-1">
                              <span className="text-xs bg-muted px-2 py-1 rounded-md">
                                {mr.sourceBranch} → {mr.targetBranch}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-between items-center">
                            <div className="flex items-center space-x-2 text-sm">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={mr.avatar} />
                                <AvatarFallback>{mr.author[0]}</AvatarFallback>
                              </Avatar>
                              <span>{mr.author}, {mr.created}</span>
                            </div>
                            <Button variant="ghost" size="sm">Review</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Recent actions in your GitLab projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {[
                        {
                          id: 1,
                          user: "Jane Smith",
                          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
                          action: "merged",
                          target: "Fix typos in documentation",
                          project: "documentation",
                          timestamp: "2 hours ago",
                          icon: <GitMerge className="h-4 w-4" />
                        },
                        {
                          id: 2,
                          user: "John Doe",
                          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
                          action: "pushed to",
                          target: "feature/auth",
                          project: "api-service",
                          timestamp: "3 hours ago",
                          icon: <GitCommitHorizontal className="h-4 w-4" />
                        },
                        {
                          id: 3,
                          user: "Dev User",
                          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=developer",
                          action: "created branch",
                          target: "feature/dark-mode",
                          project: "dashboard-redesign",
                          timestamp: "5 hours ago",
                          icon: <GitBranch className="h-4 w-4" />
                        },
                        {
                          id: 4,
                          user: "Alex Johnson",
                          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
                          action: "closed issue",
                          target: "Update API documentation",
                          project: "documentation",
                          timestamp: "1 day ago",
                          icon: <Check className="h-4 w-4" />
                        },
                        {
                          id: 5,
                          user: "Jane Smith",
                          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
                          action: "created merge request",
                          target: "Dashboard UI improvements",
                          project: "dashboard-redesign",
                          timestamp: "2 days ago",
                          icon: <GitPullRequest className="h-4 w-4" />
                        }
                      ].map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src={activity.avatar} />
                            <AvatarFallback>{activity.user[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-1">
                              <span className="font-medium">{activity.user}</span>
                              <span>{activity.action}</span>
                              <span className="font-medium">{activity.target}</span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 flex items-center space-x-1">
                              <span className="inline-flex items-center space-x-1">
                                {activity.icon}
                                <span>{activity.project}</span>
                              </span>
                              <span>•</span>
                              <span>{activity.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
