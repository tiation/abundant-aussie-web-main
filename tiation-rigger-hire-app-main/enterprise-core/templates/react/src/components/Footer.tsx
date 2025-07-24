
import React from 'react';
import { Sparkles, Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <footer className="bg-warm-white border-t border-border relative">
      <div className="absolute inset-0 leopard-pattern-subtle opacity-5"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-dark to-purple-medium rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-playfair font-bold text-gradient-purple">MUPAN</h3>
                <p className="text-xs text-muted-foreground">Wellness & Mindfulness</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Nurturing wellness through mindful practices, holistic healing, and compassionate guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-playfair font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <button 
                onClick={() => handleNavClick('#home')}
                className="text-muted-foreground hover:text-primary transition-colors text-left"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('#about')}
                className="text-muted-foreground hover:text-primary transition-colors text-left"
              >
                About
              </button>
              <button 
                onClick={() => handleNavClick('#services')}
                className="text-muted-foreground hover:text-primary transition-colors text-left"
              >
                Services
              </button>
              <button 
                onClick={() => handleNavClick('#wellness')}
                className="text-muted-foreground hover:text-primary transition-colors text-left"
              >
                Wellness
              </button>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-playfair font-semibold text-foreground">Services</h4>
            <nav className="flex flex-col space-y-2">
              <span className="text-muted-foreground">Mindfulness Coaching</span>
              <span className="text-muted-foreground">Energy Healing</span>
              <span className="text-muted-foreground">Group Sessions</span>
              <span className="text-muted-foreground">Life Coaching</span>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-playfair font-semibold text-foreground">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary" />
                <a 
                  href="mailto:hello@mupan.wellness"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  hello@mupan.wellness
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary" />
                <a 
                  href="tel:+15551234567"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground text-sm">123 Wellness Lane</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © 2024 MUPAN Wellness. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-muted-foreground text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-primary" />
            <span>for wellness</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
