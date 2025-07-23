
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock chat data
const initialMessages = [
  {
    id: "1",
    sender: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    content: "Hi team, how's the dashboard redesign coming along?",
    timestamp: "10:30 AM"
  },
  {
    id: "2",
    sender: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    content: "Making good progress! Should be ready for review by end of day.",
    timestamp: "10:32 AM"
  },
  {
    id: "3",
    sender: "Alex Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    content: "I've completed the API integration component and pushing to the staging branch now.",
    timestamp: "10:45 AM"
  }
];

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      sender: user?.name || "Anonymous",
      avatar: user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, message]);
    setNewMessage("");
    toast({
      description: "Message sent",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">Team Chat</h1>
          <p className="text-muted-foreground">Connect with your team members</p>
        </div>
        
        <div className="flex-1 overflow-hidden flex">
          <div className="w-64 border-r p-3 hidden md:block">
            <div className="font-medium mb-2">Active Users</div>
            <div className="space-y-2">
              {["John Doe", "Jane Smith", "Alex Johnson", "Developer User"].map((name, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name.toLowerCase().replace(/\s/g, '')}`} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col p-4 h-full">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex items-start space-x-3 ${message.sender === user?.name ? 'justify-end' : ''}`}
                  >
                    {message.sender !== user?.name && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={message.avatar} />
                        <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[80%] ${message.sender === user?.name ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-sm">{message.sender}</span>
                        <span className="text-xs opacity-70">{message.timestamp}</span>
                      </div>
                      <p>{message.content}</p>
                    </div>
                    {message.sender === user?.name && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={message.avatar} />
                        <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="flex items-center space-x-2 mt-4">
              <Input 
                placeholder="Type your message..." 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
