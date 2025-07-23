
import React from 'react';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, User, Award, CalendarDays, BookOpen, Sparkles } from 'lucide-react';

const AppSidebar: React.FC = () => {
  return (
    <Sidebar>
      <SidebarContent className="pt-6">
        <div className="px-4 space-y-2">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link to="/characters/new">
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Characters
            </Button>
          </Link>
          <Link to="/features">
            <Button variant="ghost" className="w-full justify-start">
              <Sparkles className="mr-2 h-4 w-4" />
              New Features
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start">
            <BookOpen className="mr-2 h-4 w-4" />
            Roleplay
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Award className="mr-2 h-4 w-4" />
            Achievements
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <CalendarDays className="mr-2 h-4 w-4" />
            Events
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
