
import React from 'react';
import { ArrowRight, Heart, Leaf, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const handleStartJourney = () => {
    const servicesElement = document.querySelector('#services');
    if (servicesElement) {
      servicesElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleLearnMore = () => {
    const aboutElement = document.querySelector('#about');
    if (aboutElement) {
      aboutElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
      {/* Background Pattern - Now 80% transparent */}
      <div className="absolute inset-0 leopard-pattern-subtle"></div>
      
      <div className="container mx-auto mobile-padding py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 lg:space-y-8 animate-fade-in text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-playfair font-bold leading-tight">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Tiation</span>
                {' '}React Template
              </h1>
              <p className="mobile-text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                A production-ready React template with modern tooling, enterprise-grade architecture, 
                and dark neon theme. Perfect for building scalable web applications.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                onClick={handleStartJourney}
                className="bg-primary hover:bg-primary/90 text-primary-foreground group w-full sm:w-auto"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleLearnMore}
                className="border-primary text-primary hover:bg-accent w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>

            {/* Stats - Mobile optimized */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6 pt-6 lg:pt-8">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-playfair font-bold text-primary">500+</div>
                <div className="text-xs lg:text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-playfair font-bold text-primary">5+</div>
                <div className="text-xs lg:text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-playfair font-bold text-primary">20+</div>
                <div className="text-xs lg:text-sm text-muted-foreground">Wellness Programs</div>
              </div>
            </div>
          </div>

          {/* Visual Elements - Mobile optimized */}
          <div className="relative mt-8 lg:mt-0">
            <div className="relative z-10 space-y-4 lg:space-y-6">
              {/* Floating Cards - Responsive sizing */}
              <div className="bg-card rounded-2xl p-4 lg:p-6 shadow-lg animate-float border border-border">
                <div className="flex items-center space-x-3 lg:space-x-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-light rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm lg:text-base">Mindfulness</h3>
                    <p className="text-xs lg:text-sm text-muted-foreground">Find inner peace</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-4 lg:p-6 shadow-lg animate-float ml-4 lg:ml-8 border border-border" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-3 lg:space-x-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-accent rounded-full flex items-center justify-center">
                    <Leaf className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm lg:text-base">Natural Healing</h3>
                    <p className="text-xs lg:text-sm text-muted-foreground">Holistic approach</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-4 lg:p-6 shadow-lg animate-float border border-border" style={{ animationDelay: '2s' }}>
                <div className="flex items-center space-x-3 lg:space-x-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-light rounded-full flex items-center justify-center">
                    <Sun className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm lg:text-base">Vitality</h3>
                    <p className="text-xs lg:text-sm text-muted-foreground">Energize your life</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decorative Elements - Responsive sizing */}
            <div className="absolute top-0 right-0 w-20 h-20 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-light to-purple-medium rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-leopard-primary to-leopard-accent rounded-full opacity-30 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
