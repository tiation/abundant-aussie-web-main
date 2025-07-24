
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { User, Book, Settings, Heart, Sparkles, Rainbow, Party } from 'lucide-react';
import { useTheme } from '../Theme/ThemeProvider';

const Navbar: React.FC = () => {
  const { theme } = useTheme();
  const isRomantic = theme === 'romantic';

  return (
    <header className={`${isRomantic ? 'bg-funky-gradient animate-pulse' : 'bg-gradient-to-r from-funky-blue via-funky-purple to-funky-pink'} text-white border-b border-primary/20 px-4 h-16 shadow-lg`}>
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <Link to="/" className="flex items-center gap-2">
            {isRomantic ? (
              <Heart className="w-6 h-6 animate-heartbeat text-white" />
            ) : (
              <Sparkles className="w-6 h-6 animate-pulse text-yellow-200" />
            )}
            <span className="text-xl font-script font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-200">D&D Campaign Manager</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Settings className="w-5 h-5 animate-spin-slow" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
