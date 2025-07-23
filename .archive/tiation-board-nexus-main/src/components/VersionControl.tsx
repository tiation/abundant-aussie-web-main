
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, GitCommitHorizontal, GitMerge, GitPullRequest } from "lucide-react";

export function VersionControl() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Version Control</CardTitle>
            <CardDescription>Connected to GitLab</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1">
              <GitBranch className="h-4 w-4" />
              New Branch
            </Button>
            <Button size="sm" variant="default" className="gap-1">
              <GitPullRequest className="h-4 w-4" />
              New PR
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="commits">
          <TabsList className="mb-4">
            <TabsTrigger value="commits">Recent Commits</TabsTrigger>
            <TabsTrigger value="branches">Branches</TabsTrigger>
            <TabsTrigger value="prs">Pull Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="commits" className="space-y-4">
            {[
              {
                id: 'c1',
                hash: 'a1b2c3d',
                message: 'Update dashboard UI components',
                author: 'John Doe',
                time: '2 hours ago',
                branch: 'main'
              },
              {
                id: 'c2',
                hash: 'e4f5g6h',
                message: 'Fix authentication bug',
                author: 'Jane Smith',
                time: '5 hours ago',
                branch: 'bugfix/auth-flow'
              },
              {
                id: 'c3',
                hash: 'i7j8k9l',
                message: 'Add project metrics feature',
                author: 'John Doe',
                time: '1 day ago',
                branch: 'feature/metrics'
              }
            ].map(commit => (
              <div key={commit.id} className="flex items-start gap-3 p-3 border rounded-md">
                <GitCommitHorizontal className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium truncate">{commit.message}</div>
                    <Badge variant="outline" className="ml-2 shrink-0">{commit.hash}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 flex items-center justify-between">
                    <span>{commit.author} committed {commit.time}</span>
                    <Badge variant="secondary" className="text-xs">{commit.branch}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="branches">
            <div className="space-y-4">
              {[
                { name: 'main', lastCommit: '2 hours ago', commits: 156, author: 'John Doe', isDefault: true },
                { name: 'develop', lastCommit: '4 hours ago', commits: 143, author: 'Team', isDefault: false },
                { name: 'feature/user-dashboard', lastCommit: '1 day ago', commits: 24, author: 'Jane Smith', isDefault: false },
                { name: 'bugfix/auth-flow', lastCommit: '5 hours ago', commits: 7, author: 'Jane Smith', isDefault: false },
              ].map(branch => (
                <div key={branch.name} className="flex items-start gap-3 p-3 border rounded-md">
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
                  <Button variant="ghost" size="sm">Checkout</Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="prs">
            <div className="space-y-4">
              {[
                { id: 'pr1', title: 'Implement user dashboard', author: 'Jane Smith', status: 'open', sourceBranch: 'feature/user-dashboard', targetBranch: 'develop', comments: 5, time: '2 days ago' },
                { id: 'pr2', title: 'Fix authentication bugs', author: 'John Doe', status: 'review', sourceBranch: 'bugfix/auth-flow', targetBranch: 'develop', comments: 3, time: '1 day ago' },
                { id: 'pr3', title: 'Update documentation', author: 'Alex Johnson', status: 'approved', sourceBranch: 'docs/update', targetBranch: 'main', comments: 1, time: '12 hours ago' }
              ].map(pr => (
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
                      <span>{pr.author} opened {pr.time}</span>
                      <div>
                        <span className="text-xs">
                          {pr.sourceBranch} → {pr.targetBranch}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
