
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileIcon, PlayIcon, Plus, RefreshCw, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Mock notebooks and data
const notebooks = [
  {
    id: "1",
    name: "Data Analysis.ipynb",
    lastModified: "2 hours ago",
    status: "running",
    author: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    kernelType: "python3"
  },
  {
    id: "2",
    name: "Visualization.ipynb",
    lastModified: "1 day ago",
    status: "idle",
    author: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    kernelType: "python3"
  },
  {
    id: "3",
    name: "ML Model Training.ipynb",
    lastModified: "3 days ago",
    status: "idle",
    author: "Alex Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    kernelType: "python3"
  }
];

export default function JupyterHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNotebook, setActiveNotebook] = useState(notebooks[0]);
  const { toast } = useToast();

  const handleLaunchNotebook = (notebook: typeof notebooks[0]) => {
    setActiveNotebook(notebook);
    toast({
      title: "Notebook Launched",
      description: `${notebook.name} has been launched successfully.`,
    });
  };

  const filteredNotebooks = searchQuery
    ? notebooks.filter(notebook => 
        notebook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notebook.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notebooks;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          <header>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">JupyterHub</h1>
                <p className="text-muted-foreground mt-1">Work with interactive notebooks and data analysis</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Notebook
                </Button>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Notebooks</CardTitle>
                <div className="mt-2">
                  <Input 
                    placeholder="Search notebooks..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-260px)]">
                  <div className="divide-y">
                    {filteredNotebooks.map((notebook) => (
                      <div 
                        key={notebook.id}
                        className={`p-3 hover:bg-accent cursor-pointer ${activeNotebook?.id === notebook.id ? 'bg-accent' : ''}`}
                        onClick={() => handleLaunchNotebook(notebook)}
                      >
                        <div className="flex items-center space-x-3">
                          <FileIcon className="h-5 w-5 text-blue-500" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{notebook.name}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <span>Modified {notebook.lastModified}</span>
                              <span className="mx-1">•</span>
                              <Badge variant="outline" className="text-xs h-5">
                                {notebook.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredNotebooks.length === 0 && (
                      <div className="p-6 text-center">
                        <p className="text-muted-foreground">No notebooks found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{activeNotebook?.name}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center space-x-2 mt-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={activeNotebook?.avatar} />
                          <AvatarFallback>{activeNotebook?.author[0]}</AvatarFallback>
                        </Avatar>
                        <span>{activeNotebook?.author}</span>
                        <span>•</span>
                        <span>Kernel: {activeNotebook?.kernelType}</span>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Terminal className="h-4 w-4 mr-2" />
                      Terminal
                    </Button>
                    <Button size="sm">
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Run
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="notebook">
                  <TabsList className="mb-4">
                    <TabsTrigger value="notebook">Notebook</TabsTrigger>
                    <TabsTrigger value="console">Console</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                  </TabsList>
                  <TabsContent value="notebook">
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-muted p-2 flex justify-between items-center border-b">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">In [1]:</Badge>
                          <span className="text-sm">Code</span>
                        </div>
                        <div>
                          <Button size="sm" variant="ghost">
                            <PlayIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 bg-black text-white font-mono text-sm whitespace-pre overflow-auto">
                        {`import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load the dataset
data = pd.read_csv('ngo_projects.csv')
print(data.head())`}
                      </div>
                      <div className="bg-muted p-2 flex justify-between items-center border-b border-t">
                        <div className="flex items-center space-x-2">
                          <Badge>Out [1]:</Badge>
                        </div>
                      </div>
                      <div className="p-4 bg-white border-t">
                        <div className="font-mono text-sm">
                          <pre>{`      project_id    project_name      status  completion  budget
0            1  Water Access    completed        100%  $25,000
1            2  Education Hub  in progress         45%  $40,000
2            3  Health Clinic    planning          0%  $60,000
3            4   Solar Energy    completed        100%  $35,000
4            5   Food Security  in progress         70%  $28,000`}</pre>
                        </div>
                      </div>

                      <div className="bg-muted p-2 flex justify-between items-center border-b border-t">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">In [2]:</Badge>
                          <span className="text-sm">Code</span>
                        </div>
                        <div>
                          <Button size="sm" variant="ghost">
                            <PlayIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 bg-black text-white font-mono text-sm whitespace-pre overflow-auto">
                        {`# Visualize the budget distribution
plt.figure(figsize=(10, 6))
plt.bar(data['project_name'], data['budget'].str.replace('$', '').str.replace(',', '').astype(int))
plt.title('Project Budget Distribution')
plt.xlabel('Project')
plt.ylabel('Budget (USD)')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()`}
                      </div>

                      <div className="p-4 bg-white border-t">
                        <div className="text-center text-muted-foreground">
                          [Budget chart visualization would appear here]
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="console">
                    <div className="border rounded-md p-4 bg-black text-white font-mono text-sm h-[400px] overflow-auto">
                      <div>Python 3.10.4 | packaged by conda-forge | (main, Mar 30 2022, 08:38:02) [MSC v.1916 64 bit]</div>
                      <div>Type 'copyright', 'credits' or 'license' for more information</div>
                      <div className="mt-2">IPython 8.2.0 -- An enhanced Interactive Python.</div>
                      <div className="mt-4 flex">
                        <span className="text-green-500 mr-2">In [1]:</span>
                        <span>import pandas as pd</span>
                      </div>
                      <div className="mt-2 flex">
                        <span className="text-green-500 mr-2">In [2]:</span>
                        <span>data = pd.read_csv('ngo_projects.csv')</span>
                      </div>
                      <div className="mt-2 flex">
                        <span className="text-green-500 mr-2">In [3]:</span>
                        <span>print(data.shape)</span>
                      </div>
                      <div className="mt-1 flex">
                        <span className="text-red-500 mr-2">Out[3]:</span>
                        <span>(5, 5)</span>
                      </div>
                      <div className="mt-4">
                        <span className="text-green-500 mr-2">In [4]:</span>
                        <span className="animate-pulse">_</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="files">
                    <div className="border rounded-md">
                      <div className="p-2 bg-muted border-b">
                        <Input placeholder="Filter files..." size={1} />
                      </div>
                      <ScrollArea className="h-[400px]">
                        <div className="divide-y">
                          {[
                            { name: "ngo_projects.csv", size: "4.2 KB", modified: "2 hours ago", type: "csv" },
                            { name: "analysis_functions.py", size: "2.8 KB", modified: "1 day ago", type: "python" },
                            { name: "visualization.ipynb", size: "15.7 KB", modified: "1 day ago", type: "notebook" },
                            { name: "project_report.pdf", size: "1.2 MB", modified: "1 week ago", type: "pdf" },
                            { name: "data_cleanup.py", size: "1.5 KB", modified: "2 weeks ago", type: "python" },
                            { name: "README.md", size: "3.7 KB", modified: "1 month ago", type: "markdown" },
                          ].map((file, index) => (
                            <div key={index} className="flex items-center p-3 hover:bg-accent cursor-pointer">
                              <FileIcon className="h-5 w-5 mr-3 text-blue-500" />
                              <div className="flex-1">
                                <p className="text-sm">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{file.size}</p>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {file.modified}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
