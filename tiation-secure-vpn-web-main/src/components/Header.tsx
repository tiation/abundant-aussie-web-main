
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-cyan-neon/10 rounded-lg">
              <Shield className="h-6 w-6 text-cyan-neon" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Gadtia VPN</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-cyan-neon transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-cyan-neon transition-colors">Pricing</a>
            <a href="#security" className="text-gray-600 hover:text-cyan-neon transition-colors">Security</a>
            <a href="#contact" className="text-gray-600 hover:text-cyan-neon transition-colors">Contact</a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-cyan-neon text-cyan-neon hover:bg-cyan-neon hover:text-white">
              Sign In
            </Button>
            <Button className="bg-cyan-neon hover:bg-cyan-600 text-black font-semibold animate-glow">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-600 hover:text-cyan-neon transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-cyan-neon transition-colors">Pricing</a>
              <a href="#security" className="text-gray-600 hover:text-cyan-neon transition-colors">Security</a>
              <a href="#contact" className="text-gray-600 hover:text-cyan-neon transition-colors">Contact</a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" className="border-cyan-neon text-cyan-neon hover:bg-cyan-neon hover:text-white">
                  Sign In
                </Button>
                <Button className="bg-cyan-neon hover:bg-cyan-600 text-black font-semibold">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
