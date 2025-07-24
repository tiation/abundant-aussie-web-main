
import React from 'react';
import { Brain, Users, Zap, Shield, Flower, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ServicesSection = () => {
  const services = [
    {
      icon: Brain,
      title: 'Mindfulness Coaching',
      description: 'Personal guidance to develop mindfulness practices and mental clarity through meditation and breathing techniques.',
      color: 'purple-light'
    },
    {
      icon: Users,
      title: 'Group Wellness Sessions',
      description: 'Join our community in group sessions focusing on collective healing, support, and wellness practices.',
      color: 'purple-medium'
    },
    {
      icon: Zap,
      title: 'Energy Healing',
      description: 'Restore your natural energy flow through various healing modalities including Reiki and chakra balancing.',
      color: 'purple-light'
    },
    {
      icon: Shield,
      title: 'Stress Management',
      description: 'Learn practical techniques to manage stress, anxiety, and create healthy boundaries in your daily life.',
      color: 'purple-medium'
    },
    {
      icon: Flower,
      title: 'Holistic Wellness',
      description: 'Comprehensive approach to wellness incorporating mind, body, and spirit for complete transformation.',
      color: 'purple-light'
    },
    {
      icon: Star,
      title: 'Life Coaching',
      description: 'Personalized guidance to help you discover your purpose, set goals, and create the life you desire.',
      color: 'purple-medium'
    }
  ];

  return (
    <section id="services" className="py-20 bg-warm-white relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 leopard-pattern-subtle opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold mb-6">
            Our <span className="text-gradient-purple">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our comprehensive range of wellness services designed to nurture your 
            mind, body, and spirit on your journey to holistic health.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={service.title} 
              className="group hover:shadow-xl transition-all duration-300 border-border hover:border-primary/20 bg-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-playfair">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-card rounded-full px-6 py-3 border border-border">
            <span className="text-sm text-muted-foreground">Ready to begin?</span>
            <button className="text-primary font-medium hover:text-primary/80 transition-colors">
              Book a consultation →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
