
import React, { useState } from 'react';
import { Menu, X, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoImage from '@/assets/coordination-support-logo.png';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Resources', href: '#resources' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="Coordination & Support Logo" 
              className="h-10 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">Standing Strong</span>
              <span className="text-xs text-blue-600 font-medium">Support Services</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <Button 
              className="gradient-bg text-white hover:opacity-90 transition-opacity"
              onClick={() => handleNavClick('#contact')}
            >
              Get Support
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-border">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              <div className="px-3 pt-2">
                <Button 
                  className="w-full gradient-bg text-white hover:opacity-90 transition-opacity"
                  onClick={() => handleNavClick('#contact')}
                >
                  Get Support
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
