
import React from 'react';
import { Moon, Sun, Droplets, Wind } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const WellnessSection = () => {
  const tips = [
    {
      icon: Sun,
      title: 'Morning Rituals',
      description: 'Start your day with intention through mindful morning practices.',
      tip: 'Take 5 minutes each morning for deep breathing and gratitude reflection.',
      time: 'Morning'
    },
    {
      icon: Droplets,
      title: 'Hydration Mindfulness',
      description: 'Transform drinking water into a mindful practice.',
      tip: 'Before each sip, pause and appreciate the nourishment you\'re giving your body.',
      time: 'Throughout Day'
    },
    {
      icon: Wind,
      title: 'Breathing Breaks',
      description: 'Use breath as an anchor to the present moment.',
      tip: 'Practice 4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8.',
      time: 'Anytime'
    },
    {
      icon: Moon,
      title: 'Evening Reflection',
      description: 'End your day with peaceful reflection and release.',
      tip: 'Journal three things you\'re grateful for and one lesson learned today.',
      time: 'Evening'
    }
  ];

  return (
    <section id="wellness" className="py-20 bg-cream relative">
      {/* Background elements */}
      <div className="absolute inset-0 leopard-pattern-subtle opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold mb-6">
            Daily <span className="text-gradient-purple">Wellness</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Small, mindful actions throughout your day can create profound shifts in your 
            overall wellbeing. Here are some gentle practices to integrate into your routine.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {tips.map((tip, index) => (
            <Card 
              key={tip.title} 
              className="group hover:shadow-lg transition-all duration-300 border-border bg-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-purple-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <tip.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="inline-block px-3 py-1 bg-accent rounded-full text-xs font-medium text-primary mb-2">
                  {tip.time}
                </div>
                <CardTitle className="text-lg font-playfair">{tip.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <CardDescription className="text-muted-foreground">
                  {tip.description}
                </CardDescription>
                <div className="bg-warm-white rounded-lg p-4 border border-border">
                  <p className="text-sm text-foreground font-medium">
                    💡 {tip.tip}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Wellness Quote */}
        <div className="bg-card rounded-3xl p-8 lg:p-12 border border-border relative overflow-hidden">
          <div className="absolute inset-0 leopard-pattern opacity-5"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-dark to-purple-medium rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl text-white">"</span>
            </div>
            <blockquote className="text-2xl lg:text-3xl font-playfair font-medium text-foreground mb-6 leading-relaxed">
              "Wellness is not a destination, but a journey of small, conscious choices 
              that lead to profound transformation."
            </blockquote>
            <p className="text-muted-foreground font-medium">— MUPAN Wellness Philosophy</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WellnessSection;
