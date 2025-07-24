
import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ContactSection = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'hello@mupan.wellness',
      action: 'Send Email'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: '+1 (555) 123-4567',
      action: 'Call Now'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: '123 Wellness Lane, Peaceful City',
      action: 'Get Directions'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold mb-6">
            Get in <span className="text-gradient-purple">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to begin your wellness journey? We're here to support you every step of the way. 
            Reach out to learn more about our services or to schedule your first session.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((info, index) => (
            <Card 
              key={info.title} 
              className="group hover:shadow-lg transition-all duration-300 border-border text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-purple-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <info.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-playfair">{info.title}</CardTitle>
                <CardDescription className="text-lg text-foreground font-medium">
                  {info.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="border-primary text-primary hover:bg-accent">
                  {info.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-border bg-card relative overflow-hidden">
            <div className="absolute inset-0 leopard-pattern-subtle opacity-5"></div>
            <CardHeader className="text-center relative z-10">
              <CardTitle className="text-2xl font-playfair">Send us a Message</CardTitle>
              <CardDescription>
                Share your wellness goals and we'll help you create a personalized plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                    First Name
                  </label>
                  <Input id="firstName" placeholder="Your first name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                    Last Name
                  </label>
                  <Input id="lastName" placeholder="Your last name" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input id="email" type="email" placeholder="your.email@example.com" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Subject
                </label>
                <Input id="subject" placeholder="How can we help you?" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message
                </label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us about your wellness goals and how we can support your journey..."
                  rows={5}
                />
              </div>
              
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group">
                Send Message
                <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
