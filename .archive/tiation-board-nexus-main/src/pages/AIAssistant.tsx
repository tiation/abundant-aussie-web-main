
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Send, RefreshCw, Sparkles, MessageSquareText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

// Mock AI conversation history
const initialConversation = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI assistant. How can I help you with Tiation board development today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

type AIModel = {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  contextLength: number;
};

const availableModels: AIModel[] = [
  {
    id: "gpt4o",
    name: "GPT-4o",
    description: "Advanced AI model with strong reasoning capabilities",
    capabilities: ["Text generation", "Code writing", "Problem solving"],
    contextLength: 32000
  },
  {
    id: "claude3",
    name: "Claude 3",
    description: "Balanced model with strong writing capabilities",
    capabilities: ["Text analysis", "Content creation", "Summarization"],
    contextLength: 100000
  },
  {
    id: "llama3",
    name: "Llama 3",
    description: "Open source model with good performance",
    capabilities: ["Text generation", "Question answering", "Content creation"],
    contextLength: 8000
  },
  {
    id: "mistral",
    name: "Mistral",
    description: "Fast and efficient model for general tasks",
    capabilities: ["Text generation", "Classification", "Question answering"],
    contextLength: 8000
  }
];

export default function AIAssistant() {
  const [conversation, setConversation] = useState(initialConversation);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>(availableModels[0]);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to conversation
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setConversation(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const dummyResponses = [
        "Based on the NGO dashboard requirements, I'd recommend implementing a responsive design with a focus on accessibility. Have you considered using data visualization libraries like Chart.js or D3.js?",
        "Looking at your code, there's an opportunity to improve the authentication flow. Consider implementing token refresh mechanisms to enhance security while maintaining a smooth user experience.",
        "For the GitLab integration, you'll want to use their REST API. Here's a sample code snippet to get you started:\n\n```javascript\nconst fetchProjects = async () => {\n  const response = await fetch('https://gitlab.com/api/v4/projects', {\n    headers: { 'Authorization': `Bearer ${token}` }\n  });\n  return response.json();\n};\n```",
        "The JupyterHub integration looks good, but you might want to consider adding session persistence. This would allow users to continue their work even after browser refreshes or connectivity issues."
      ];

      const randomResponse = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
      
      const aiResponse = {
        id: Date.now().toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setConversation(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleClearChat = () => {
    setConversation(initialConversation);
    toast({
      title: "Chat Cleared",
      description: "Your conversation has been reset.",
    });
  };

  const changeModel = (model: AIModel) => {
    setSelectedModel(model);
    toast({
      title: "Model Changed",
      description: `Now using ${model.name} for responses.`,
    });
  };

  const formatMessageContent = (content: string) => {
    // Simple handling for code blocks
    return content.split('```').map((part, index) => {
      if (index % 2 === 1) { // Inside code block
        return (
          <pre key={index} className="bg-muted p-2 rounded-md overflow-x-auto my-2">
            <code>{part}</code>
          </pre>
        );
      }
      // Regular text - handle line breaks
      return (
        <span key={index} style={{ whiteSpace: 'pre-wrap' }}>
          {part}
        </span>
      );
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Bot className="h-6 w-6 mr-2 text-primary" /> 
              AI Assistant
            </h1>
            <p className="text-muted-foreground">Powered by {selectedModel.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Change Model
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Select AI Model</DrawerTitle>
                  <DrawerDescription>Choose which AI model powers your assistant</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableModels.map((model) => (
                    <Card 
                      key={model.id}
                      className={`cursor-pointer hover:border-primary transition-all ${
                        selectedModel.id === model.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => changeModel(model)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg flex justify-between items-center">
                          {model.name}
                          {selectedModel.id === model.id && (
                            <Badge variant="default" className="ml-2">Active</Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground mb-2">{model.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {model.capabilities.map((capability, i) => (
                            <Badge key={i} variant="outline">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button>Done</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-48">
                <p className="text-sm">Clear the current conversation</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4 mb-4">
            {conversation.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`flex gap-3 max-w-[80%] ${
                    msg.role === "user" 
                      ? "flex-row-reverse" 
                      : "flex-row"
                  }`}
                >
                  <Avatar className="h-8 w-8 mt-1">
                    {msg.role === "user" ? (
                      <>
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                        <AvatarFallback>U</AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=ai" />
                        <AvatarFallback>AI</AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div 
                    className={`rounded-lg p-3 ${
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    }`}
                  >
                    <div className="text-sm mb-1 flex justify-between items-center gap-4">
                      <span className="font-medium">
                        {msg.role === "user" ? "You" : "AI Assistant"}
                      </span>
                      <span className="text-xs opacity-70">
                        {msg.timestamp}
                      </span>
                    </div>
                    <div className="text-sm">
                      {formatMessageContent(msg.content)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=ai" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2">
            <Input 
              placeholder="Ask the AI assistant..." 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !message.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={handleClearChat}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
