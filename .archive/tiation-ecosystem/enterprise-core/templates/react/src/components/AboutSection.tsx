
import React from 'react';
import { Heart, Leaf, Sparkles, Users } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto mobile-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4 lg:space-y-6">
              <h2 className="mobile-text-4xl lg:text-5xl font-playfair font-bold text-center lg:text-left">
                About <span className="text-gradient-purple">MUPAN</span>
              </h2>
              <p className="mobile-text-lg text-muted-foreground leading-relaxed">
                MUPAN represents more than just wellness—it's a heartfelt tribute to family, 
                combining the initials of cherished sons into a meaningful mission of healing 
                and transformation.
              </p>
              <p className="mobile-text-lg text-muted-foreground leading-relaxed">
                Our approach embraces the interconnectedness of mind, body, and spirit, 
                offering personalized wellness journeys that honor your unique path to health 
                and happiness.
              </p>
            </div>

            {/* Values - Mobile optimized */}
            <div className="space-y-4">
              <h3 className="mobile-text-2xl font-playfair font-semibold">Our Core Values</h3>
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-light rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                  </div>
                  <span className="font-medium text-sm lg:text-base">Compassion</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-accent rounded-full flex items-center justify-center">
                    <Leaf className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                  </div>
                  <span className="font-medium text-sm lg:text-base">Natural Healing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-light rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                  </div>
                  <span className="font-medium text-sm lg:text-base">Transformation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-accent rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                  </div>
                  <span className="font-medium text-sm lg:text-base">Community</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual - Mobile optimized */}
          <div className="relative">
            <div className="bg-card rounded-3xl p-6 lg:p-8 border border-border relative overflow-hidden">
              {/* Leopard pattern background - Now 80% transparent */}
              <div className="absolute inset-0 leopard-pattern"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-dark to-purple-medium rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                  </div>
                  <h3 className="mobile-text-2xl font-playfair font-bold mb-2">Our Mission</h3>
                  <p className="text-muted-foreground text-sm lg:text-base">
                    To guide individuals on their personal wellness journey, fostering healing, 
                    growth, and the discovery of inner peace through holistic practices.
                  </p>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="grid grid-cols-3 gap-3 lg:gap-4 text-center">
                    <div>
                      <div className="text-xl lg:text-2xl font-playfair font-bold text-primary">M</div>
                      <div className="text-xs text-muted-foreground">Mindfulness</div>
                    </div>
                    <div>
                      <div className="text-xl lg:text-2xl font-playfair font-bold text-primary">U</div>
                      <div className="text-xs text-muted-foreground">Unity</div>
                    </div>
                    <div>
                      <div className="text-xl lg:text-2xl font-playfair font-bold text-primary">P</div>
                      <div className="text-xs text-muted-foreground">Peace</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 lg:gap-4 text-center mt-4">
                    <div>
                      <div className="text-xl lg:text-2xl font-playfair font-bold text-primary">A</div>
                      <div className="text-xs text-muted-foreground">Awareness</div>
                    </div>
                    <div>
                      <div className="text-xl lg:text-2xl font-playfair font-bold text-primary">N</div>
                      <div className="text-xs text-muted-foreground">Nurture</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements - Mobile responsive */}
            <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-light to-purple-medium rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-2 -left-2 lg:-bottom-4 lg:-left-4 w-12 h-12 lg:w-20 lg:h-20 bg-gradient-to-br from-leopard-primary to-leopard-accent rounded-full opacity-30 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
