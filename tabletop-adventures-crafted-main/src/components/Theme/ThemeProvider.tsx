
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'fantasy' | 'scifi' | 'modern' | 'horror' | 'romantic';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('roleplay-theme');
    return (savedTheme as Theme) || 'fantasy';
  });

  useEffect(() => {
    localStorage.setItem('roleplay-theme', theme);
    
    // Set theme-specific classes on the body
    document.body.classList.remove('theme-fantasy', 'theme-scifi', 'theme-modern', 'theme-horror', 'theme-romantic');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
