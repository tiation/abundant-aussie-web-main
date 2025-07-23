
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Search, Star, Inbox, Send as SendIcon, Archive, Trash2, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock email data
const mockEmails = [
  {
    id: "1",
    subject: "Project Update - Dashboard Redesign",
    sender: "john.doe@tiation.org",
    preview: "Hi team, Attached is the latest update on the dashboard redesign project. We've made significant progress...",
    date: "Apr 30",
    read: true,
    starred: false,
    folder: "inbox"
  },
  {
    id: "2",
    subject: "Funding Proposal Review",
    sender: "finance@tiation.org",
    preview: "Please review the attached funding proposal for the Q3 initiatives. We need your feedback by Friday...",
    date: "Apr 29",
    read: false,
    starred: true,
    folder: "inbox"
  },
  {
    id: "3",
    subject: "Board Meeting - May 15th",
    sender: "secretary@tiation.org",
    preview: "This is a reminder that our next board meeting is scheduled for May 15th at 10:00 AM. Agenda attached...",
    date: "Apr 28",
    read: true,
    starred: false,
    folder: "inbox"
  },
  {
    id: "4",
    subject: "API Documentation Update",
    sender: "dev@tiation.org",
    preview: "The API documentation has been updated with the new endpoints. Please review when you have a chance...",
    date: "Apr 27",
    read: true,
    starred: false,
    folder: "inbox"
  }
];

export default function Email() {
  const { user } = useAuth();
  const [emails, setEmails] = useState(mockEmails);
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<typeof mockEmails[0] | null>(null);
  const [composeDialogOpen, setComposeDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleStarEmail = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, starred: !email.starred } : email
    ));
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Email Sent",
      description: "Your email has been sent successfully.",
    });
    setComposeDialogOpen(false);
  };

  const filteredEmails = emails.filter(email => 
    (activeTab === "inbox" || email.folder === activeTab) && 
    (searchQuery === "" || 
     email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
     email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
     email.preview.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Email</h1>
            <p className="text-muted-foreground">Manage your communications</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={composeDialogOpen} onOpenChange={setComposeDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Compose
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Compose Email</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSendEmail} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Input placeholder="To" />
                  </div>
                  <div className="space-y-2">
                    <Input placeholder="Subject" />
                  </div>
                  <div className="space-y-2">
                    <Textarea placeholder="Write your message here..." className="min-h-[200px]" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setComposeDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <SendIcon className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden flex">
          <div className="w-48 border-r md:w-64 p-4 space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => setActiveTab("inbox")}
            >
              <Inbox className="h-4 w-4 mr-2" />
              Inbox
              <span className="ml-auto bg-primary rounded-full w-6 h-6 flex items-center justify-center text-xs text-primary-foreground">
                {emails.filter(e => e.folder === "inbox" && !e.read).length}
              </span>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => setActiveTab("starred")}
            >
              <Star className="h-4 w-4 mr-2" />
              Starred
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => setActiveTab("sent")}
            >
              <SendIcon className="h-4 w-4 mr-2" />
              Sent
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => setActiveTab("archive")}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => setActiveTab("trash")}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Trash
            </Button>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search emails..." 
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="divide-y">
                {filteredEmails.map((email) => (
                  <div 
                    key={email.id} 
                    className={`p-3 cursor-pointer flex hover:bg-accent ${!email.read ? "font-medium" : ""}`}
                    onClick={() => setSelectedEmail(email)}
                  >
                    <div className="flex-shrink-0 flex items-center pr-3">
                      <button onClick={(e) => { e.stopPropagation(); handleStarEmail(email.id); }}>
                        <Star className={`h-4 w-4 ${email.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm truncate">{email.sender}</p>
                        <p className="text-xs text-muted-foreground">{email.date}</p>
                      </div>
                      <p className="text-sm font-medium">{email.subject}</p>
                      <p className="text-xs text-muted-foreground truncate">{email.preview}</p>
                    </div>
                  </div>
                ))}
                {filteredEmails.length === 0 && (
                  <div className="p-8 text-center">
                    <Mail className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-2 text-sm font-medium">No emails found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {activeTab === "inbox" ? "Your inbox is empty" : `No emails in ${activeTab}`}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {selectedEmail && (
            <div className="w-1/2 border-l hidden lg:flex lg:flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-medium">{selectedEmail.subject}</h3>
                <Button variant="ghost" size="icon" onClick={() => setSelectedEmail(null)}>
                  &times;
                </Button>
              </div>
              <div className="p-4">
                <div className="flex justify-between mb-6">
                  <div>
                    <p className="font-medium">{selectedEmail.sender}</p>
                    <p className="text-xs text-muted-foreground">To: {user?.email}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedEmail.date}</p>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p>{selectedEmail.preview}</p>
                  <p className="mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce varius faucibus massa sollicitudin amet augue. 
                    Nibh metus a semper purus mauris duis. Lorem eu neque, tristique quis duis. Nibh scelerisque ac porta tincidunt 
                    quis diam cursus vel vestibulum. Morbi sed massa dolor.
                  </p>
                  <p className="mt-4">
                    Regards,<br />
                    {selectedEmail.sender.split('@')[0]}
                  </p>
                </div>
                <div className="mt-6 space-x-2">
                  <Button>
                    <SendIcon className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  <Button variant="outline">Forward</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
