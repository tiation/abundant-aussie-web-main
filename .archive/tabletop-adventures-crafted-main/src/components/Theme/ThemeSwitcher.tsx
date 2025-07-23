
import React from 'react';
import { useTheme, Theme } from './ThemeProvider';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette, Heart, Sparkles, Skull, Building, Scroll, Rainbow, Candy, PartyPopper, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

const themes: { id: Theme; name: string; description: string; primaryColor: string; icon: React.ReactNode }[] = [
  { 
    id: 'fantasy', 
    name: 'Fantasy', 
    description: 'Medieval fantasy theme with parchment and warm colors', 
    primaryColor: 'bg-amber-500',
    icon: <Scroll className="h-4 w-4" />
  },
  { 
    id: 'scifi', 
    name: 'Sci-Fi', 
    description: 'Futuristic theme with neon and dark colors', 
    primaryColor: 'bg-cyan-400',
    icon: <Sparkles className="h-4 w-4 animate-pulse" />
  },
  { 
    id: 'modern', 
    name: 'Modern', 
    description: 'Clean and minimal contemporary design', 
    primaryColor: 'bg-indigo-500',
    icon: <Building className="h-4 w-4" />
  },
  { 
    id: 'horror', 
    name: 'Horror', 
    description: 'Dark and eerie theme with blood red accents', 
    primaryColor: 'bg-red-600',
    icon: <Skull className="h-4 w-4" />
  },
  { 
    id: 'romantic', 
    name: 'Romantic', 
    description: 'Vibrant and fun theme with colorful accents', 
    primaryColor: 'bg-gradient-to-r from-funky-purple via-funky-pink to-funky-orange',
    icon: <Heart className="h-4 w-4 text-funky-pink" />
  }
];

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-gradient-to-r from-funky-purple to-funky-pink text-white border-0 hover:bg-gradient-to-r hover:from-funky-pink hover:to-funky-purple transition-all">
          {theme === 'romantic' ? 
            <Rainbow className="h-4 w-4 animate-pulse" /> : 
            <Palette className="h-4 w-4" />}
          <span>Theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-gradient-to-br from-white to-blue-50 border-funky-purple border-2">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-funky-purple">Choose Theme</h4>
          <p className="text-xs text-muted-foreground">
            Customize the look and feel of your roleplay experience
          </p>
          <div className="grid grid-cols-1 gap-2 pt-2">
            {themes.map((t) => (
              <Card 
                key={t.id}
                className={`p-2 cursor-pointer transition-all hover:scale-105 ${
                  theme === t.id 
                    ? 'ring-2 ring-funky-pink bg-gradient-to-r from-blue-50 to-purple-50' 
                    : 'hover:bg-blue-50'
                }`}
                onClick={() => setTheme(t.id)}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${
                    t.id === 'romantic' 
                      ? 'bg-gradient-to-r from-funky-purple to-funky-pink' 
                      : t.primaryColor
                  } flex items-center justify-center text-white`}>
                    {t.icon}
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">{t.name}</h5>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  </div>
                  {theme === t.id && (
                    <Star className="ml-auto h-4 w-4 text-yellow-400 fill-yellow-400" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeSwitcher;
