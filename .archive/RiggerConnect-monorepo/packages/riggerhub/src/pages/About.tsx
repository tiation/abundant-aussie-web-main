import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Target, Users, Shield, Award, Handshake } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Safety First",
      description: "We prioritize workplace safety and compliance with WA standards in everything we do."
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: "Trust & Reliability", 
      description: "Building lasting relationships through honest communication and reliable service."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Quality Standards",
      description: "Maintaining the highest standards in worker qualifications and job matching."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Focus",
      description: "Supporting the rigging community and contributing to charitable causes."
    }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "Platform Director",
      experience: "15 years in construction recruitment"
    },
    {
      name: "Mike Thompson", 
      role: "Safety & Compliance Manager",
      experience: "20 years in mining safety"
    },
    {
      name: "Lisa Rodriguez",
      role: "Worker Relations Manager", 
      experience: "12 years in industrial relations"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-4">
                Part of the Rigger Project
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About RiggerHub
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                We're more than just a job platform. RiggerHub is part of a mission to 
                transform the rigging industry while supporting meaningful charitable work 
                through the ChaseWhiteRabbit NGO.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  RiggerHub exists to bridge the gap between skilled rigging professionals 
                  and quality employment opportunities across Western Australia's construction, 
                  mining, and resources sectors.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  As part of the broader Rigger Project ecosystem, every successful placement 
                  through our platform contributes to funding the ChaseWhiteRabbit NGO, 
                  creating a positive impact that extends far beyond individual careers.
                </p>
                <div className="flex items-center space-x-2 text-primary">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Building careers while making a difference</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-accent to-muted p-8 rounded-2xl">
                <div className="text-center">
                  <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-4">Impact Goals</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Connect 1000+ workers annually</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Partner with 200+ businesses</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Fund NGO charitable initiatives</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Improve industry safety standards</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These core values guide everything we do, from platform development 
                to worker support and business partnerships.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="border-border">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-3 rounded-lg text-primary">
                        {value.icon}
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ChaseWhiteRabbit NGO Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Supporting ChaseWhiteRabbit NGO
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Every successful job placement through RiggerHub contributes to the 
                ChaseWhiteRabbit NGO's charitable mission. This unique model ensures 
                that advancing your career also advances important social causes.
              </p>
            </div>
            
            <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="pt-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    The Rigger Project Impact
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Through the dual-platform approach (RiggerHub for workers, RiggerConnect for businesses), 
                    we create a sustainable funding model that supports charitable initiatives while 
                    serving the rigging industry's employment needs.
                  </p>
                  <Badge variant="secondary" className="text-sm">
                    Technology for Good
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Leadership Team</h2>
              <p className="text-muted-foreground">
                Industry experts committed to transforming rigging recruitment in WA.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-8">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.experience}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have questions about RiggerHub or want to learn more about the Rigger Project? 
              We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:info@riggerhub.com.au" 
                className="text-primary hover:underline font-medium"
              >
                info@riggerhub.com.au
              </a>
              <span className="hidden sm:inline text-muted-foreground">|</span>
              <a 
                href="tel:+61891234567" 
                className="text-primary hover:underline font-medium"
              >
                +61 8 9123 4567
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;