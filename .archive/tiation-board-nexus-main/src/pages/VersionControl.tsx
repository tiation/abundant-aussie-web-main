
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitBranch, GitMerge, GitCommitHorizontal, GitPullRequest, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function VersionControlPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for the version control components
  const commits = [
    {
      id: 'c1',
      hash: 'a1b2c3d',
      message: 'Update dashboard UI components',
      author: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      time: '2 hours ago',
      branch: 'main'
    },
    {
      id: 'c2',
      hash: 'e4f5g6h',
      message: 'Fix authentication bug',
      author: 'Jane Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      time: '5 hours ago',
      branch: 'bugfix/auth-flow'
    },
    {
      id: 'c3',
      hash: 'i7j8k9l',
      message: 'Add project metrics feature',
      author: 'Alex Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      time: '1 day ago',
      branch: 'feature/metrics'
    },
    {
      id: 'c4',
      hash: 'm6n5o4p',
      message: 'Update documentation',
      author: 'Sarah Williams',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      time: '2 days ago',
      branch: 'docs'
    }
  ];
  
  const branches = [
    { 
      id: 'b1',
      name: 'main', 
      lastCommit: '2 hours ago', 
      commits: 156, 
      author: 'John Doe', 
      isDefault: true 
    },
    { 
      id: 'b2',
      name: 'develop', 
      lastCommit: '4 hours ago', 
      commits: 143, 
      author: 'Team', 
      isDefault: false 
    },
    { 
      id: 'b3',
      name: 'feature/user-dashboard', 
      lastCommit: '1 day ago', 
      commits: 24, 
      author: 'Jane Smith', 
      isDefault: false 
    },
    { 
      id: 'b4',
      name: 'bugfix/auth-flow', 
      lastCommit: '5 hours ago', 
      commits: 7, 
      author: 'Jane Smith', 
      isDefault: false 
    }
  ];
  
  const pullRequests = [
    { 
      id: 'pr1', 
      title: 'Implement user dashboard', 
      author: 'Jane Smith', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      status: 'open', 
      sourceBranch: 'feature/user-dashboard', 
      targetBranch: 'develop', 
      comments: 5, 
      time: '2 days ago' 
    },
    { 
      id: 'pr2', 
      title: 'Fix authentication bugs', 
      author: 'John Doe', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      status: 'review', 
      sourceBranch: 'bugfix/auth-flow', 
      targetBranch: 'develop', 
      comments: 3, 
      time: '1 day ago' 
    },
    { 
      id: 'pr3', 
      title: 'Update documentation', 
      author: 'Alex Johnson', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      status: 'approved', 
      sourceBranch: 'docs/update', 
      targetBranch: 'main', 
      comments: 1, 
      time: '12 hours ago' 
    }
  ];

  // Filter function for search
  const filterItems = (items, query) => {
    if (!query) return items;
    return items.filter(item => {
      // For commits, search in message and author
      if (item.message) {
        return (
          item.message.toLowerCase().includes(query.toLowerCase()) || 
          item.author.toLowerCase().includes(query.toLowerCase())
        );
      }
      // For branches, search in name and author
      else if (item.name) {
        return (
          item.name.toLowerCase().includes(query.toLowerCase()) || 
          item.author.toLowerCase().includes(query.toLowerCase())
        );
      }
      // For PRs, search in title and author
      else if (item.title) {
        return (
          item.title.toLowerCase().includes(query.toLowerCase()) || 
          item.author.toLowerCase().includes(query.toLowerCase())
        );
      }
      return false;
    });
  };

  const filteredCommits = filterItems(commits, searchQuery);
  const filteredBranches = filterItems(branches, searchQuery);
  const filteredPRs = filterItems(pullRequests, searchQuery);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <header>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Version Control</h1>
                <p className="text-muted-foreground mt-1">Track changes and collaborate on code</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <GitBranch className="mr-2 h-4 w-4" />
                  New Branch
                </Button>
                <Button>
                  <GitPullRequest className="mr-2 h-4 w-4" />
                  New Pull Request
                </Button>
              </div>
            </div>

            <div className="mt-4 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search commits, branches, or pull requests..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </header>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Repository: Tiation Board</CardTitle>
                <Badge variant="outline">Connected to GitLab</Badge>
              </div>
              <CardDescription>Main development repository for Tiation Board dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="commits">
                <TabsList className="mb-4">
                  <TabsTrigger value="commits">Commits</TabsTrigger>
                  <TabsTrigger value="branches">Branches</TabsTrigger>
                  <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
                </TabsList>
                
                <TabsContent value="commits" className="space-y-4">
                  {filteredCommits.map((commit) => (
                    <div key={commit.id} className="flex items-start gap-3 p-3 border rounded-md">
                      <GitCommitHorizontal className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-medium truncate">{commit.message}</div>
                          <Badge variant="outline" className="ml-2 shrink-0">{commit.hash}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={commit.avatar} alt={commit.author} />
                              <AvatarFallback>{commit.author[0]}</AvatarFallback>
                            </Avatar>
                            <span>{commit.author} committed {commit.time}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">{commit.branch}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="branches">
                  <div className="space-y-4">
                    {filteredBranches.map((branch) => (
                      <div key={branch.id} className="flex items-start gap-3 p-3 border rounded-md">
                        <GitBranch className="h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className="font-medium">{branch.name}</div>
                            {branch.isDefault && (
                              <Badge variant="secondary" className="ml-2">default</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Updated {branch.lastCommit} • {branch.commits} commits • {branch.author}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Compare</Button>
                          <Button variant="secondary" size="sm">Checkout</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="pull-requests">
                  <div className="space-y-4">
                    {filteredPRs.map((pr) => (
                      <div key={pr.id} className="flex items-start gap-3 p-3 border rounded-md">
                        <GitMerge className="h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="font-medium truncate">{pr.title}</div>
                            <Badge 
                              variant={
                                pr.status === 'open' ? 'outline' : 
                                pr.status === 'review' ? 'secondary' : 
                                'default'
                              }
                              className="ml-2 capitalize"
                            >
                              {pr.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1 flex items-center justify-between flex-wrap gap-y-1">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={pr.avatar} alt={pr.author} />
                                <AvatarFallback>{pr.author[0]}</AvatarFallback>
                              </Avatar>
                              <span>{pr.author} opened {pr.time}</span>
                            </div>
                            <div className="text-xs px-2 py-0.5 bg-muted rounded-md">
                              {pr.sourceBranch} → {pr.targetBranch}
                            </div>
                          </div>
                        </div>
                        <Button size="sm">Review</Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
