
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCode, FolderGit, FolderSync } from "lucide-react";
import { Link } from "react-router-dom";

export function TheiaIDE() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Theia IDE</CardTitle>
            <CardDescription>Connect to your development environment</CardDescription>
          </div>
          <Button asChild>
            <Link to="/ide">Launch IDE</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="projects">
          <TabsList className="mb-4">
            <TabsTrigger value="projects">Recent Projects</TabsTrigger>
            <TabsTrigger value="connect">Connect</TabsTrigger>
            <TabsTrigger value="settings">IDE Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects">
            <div className="space-y-4">
              {[
                { id: 'p1', name: 'Dashboard UI', path: '/projects/dashboard-ui', lastOpened: '2 hours ago' },
                { id: 'p2', name: 'API Integration', path: '/projects/api-integration', lastOpened: 'Yesterday' },
                { id: 'p3', name: 'Database Models', path: '/projects/database-models', lastOpened: '3 days ago' },
              ].map(project => (
                <div key={project.id} className="flex items-center gap-3 p-3 border rounded-md">
                  <FolderGit className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-muted-foreground">{project.path}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Opened {project.lastOpened}
                  </div>
                  <Button size="sm" variant="secondary" asChild>
                    <Link to="/ide">Open</Link>
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="connect">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="repository">GitLab Repository URL</Label>
                <div className="flex space-x-2">
                  <Input id="repository" placeholder="https://gitlab.com/tiation/project-name" />
                  <Button type="button">Clone</Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Or select a repository to import</h3>
                <div className="space-y-3">
                  {[
                    { id: 'r1', name: 'tiation/frontend', description: 'Frontend web application' },
                    { id: 'r2', name: 'tiation/api', description: 'Backend REST API' },
                    { id: 'r3', name: 'tiation/docs', description: 'Documentation site' },
                  ].map(repo => (
                    <div key={repo.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <FolderGit className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{repo.name}</div>
                          <div className="text-sm text-muted-foreground">{repo.description}</div>
                        </div>
                      </div>
                      <Button size="sm">Import</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">IDE Theme</Label>
                <select id="theme" className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="highContrast">High Contrast</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <select id="fontFamily" className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option value="monospace">Monospace</option>
                  <option value="firaCode">Fira Code</option>
                  <option value="jetBrainsMono">JetBrains Mono</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Input id="fontSize" type="number" defaultValue={14} min={10} max={24} />
              </div>
              
              <div className="flex items-center space-x-2">
                <input id="autoSave" type="checkbox" className="rounded border-gray-300" />
                <Label htmlFor="autoSave">Auto Save</Label>
              </div>
              
              <Button type="button" className="mt-2">Save Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
