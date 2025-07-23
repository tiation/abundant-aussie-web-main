import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Database, 
  LogIn, 
  User, 
  Home,
  FileCode, 
  GitBranch, 
  GitCommitHorizontal, 
  GitFork,
  Settings,
  LayoutDashboard,
  FolderGit,
  MessageCircle,
  Mail,
  Code,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
};

const NavItem = ({ to, icon: Icon, label, isCollapsed }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : 
        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon size={20} />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={cn(
      "flex flex-col h-screen bg-sidebar bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl">Tiation</span>
            <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">Board</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto" 
          onClick={toggleSidebar}
        >
          {isCollapsed ? "→" : "←"}
        </Button>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" isCollapsed={isCollapsed} />
          <NavItem to="/projects" icon={FolderGit} label="Theia Projects" isCollapsed={isCollapsed} />
          <NavItem to="/version-control" icon={GitBranch} label="Version Control" isCollapsed={isCollapsed} />
          <NavItem to="/ide" icon={FileCode} label="Theia IDE" isCollapsed={isCollapsed} />
          <NavItem to="/chat" icon={MessageCircle} label="Chat" isCollapsed={isCollapsed} />
          <NavItem to="/email" icon={Mail} label="Email" isCollapsed={isCollapsed} />
          <NavItem to="/gitlab" icon={Code} label="GitLab" isCollapsed={isCollapsed} />
          <NavItem to="/jupyter" icon={FileCode} label="JupyterHub" isCollapsed={isCollapsed} />
          <NavItem to="/ai-assistant" icon={Bot} label="AI Assistant" isCollapsed={isCollapsed} />
          <NavItem to="/settings" icon={Settings} label="Settings" isCollapsed={isCollapsed} />
        </nav>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <div className="p-4">
        {user ? (
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed ? "justify-center" : "justify-start"
          )}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <Button 
                  variant="link" 
                  onClick={logout} 
                  className="h-auto p-0 text-xs justify-start text-sidebar-foreground/80"
                >
                  Sign out
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size={isCollapsed ? "icon" : "default"} 
            asChild
          >
            <Link to="/">
              <LogIn className="h-5 w-5 mr-2" />
              {!isCollapsed && "Sign in"}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
