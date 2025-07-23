import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Search, 
  Bell, 
  Shield, 
  MapPin, 
  TrendingUp,
  Users,
  Award
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Intelligent Talent Matching",
      description: "Advanced AI algorithms analyze your comprehensive skill matrix, certifications, and experience to deliver precision-matched opportunities that align with your career trajectory and earning potential.",
      color: "text-primary"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Digital Credential Vault",
      description: "Enterprise-grade secure storage for all professional certifications, safety tickets, licenses, and qualifications with automated renewal tracking and industry compliance verification.",
      color: "text-secondary"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Real-Time Opportunity Alerts",
      description: "Instantaneous notifications powered by intelligent filters that deliver high-priority job matches, urgent placements, and exclusive industry opportunities directly to your mobile device.",
      color: "text-primary"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Regulatory Compliance Engine",
      description: "Comprehensive tracking system ensuring adherence to WA safety regulations, industry standards, and certification requirements with predictive renewal alerts and compliance scoring.",
      color: "text-success"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Geographic Intelligence",
      description: "Sophisticated location-based matching that considers travel preferences, regional rates, accommodation availability, and proximity to maximize your earning potential across WA.",
      color: "text-secondary"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Career Analytics Dashboard",
      description: "Comprehensive performance metrics tracking earnings progression, skill development, employment patterns, and market positioning with predictive career pathway recommendations.",
      color: "text-primary"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Professional Network Hub",
      description: "Connect with industry leaders, mentors, and peers through our verified professional network. Build relationships that accelerate career growth and unlock exclusive opportunities.",
      color: "text-accent"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Performance Recognition System",
      description: "Showcase your achievements with verified work ratings, safety records, and professional endorsements that enhance your market value and attract premium employers.",
      color: "text-success"
    }
  ];

  const stats = [
    { number: "2-5x", label: "Faster Job Placement", icon: <TrendingUp className="w-5 h-5" /> },
    { number: "98%", label: "Worker Satisfaction", icon: <Users className="w-5 h-5" /> },
    { number: "24/7", label: "Platform Availability", icon: <Shield className="w-5 h-5" /> },
    { number: "100%", label: "Verified Companies", icon: <Award className="w-5 h-5" /> }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Enterprise-Grade Platform for <span className="text-primary">Professional Excellence</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            RiggerHub delivers a comprehensive suite of advanced tools and intelligent systems designed to accelerate career growth, 
            maximize earning potential, and establish lasting professional success in the dynamic rigging and construction industry.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="card-lift border-border hover:shadow-lg transition-all duration-300 group cursor-pointer animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-accent flex items-center justify-center ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary to-primary-hover rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Trusted by Industry Leaders</h3>
            <p className="text-white/90">Join thousands of riggers who've advanced their careers with RiggerHub</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2 text-secondary">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-1">{stat.number}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Find Your Next Opportunity?</h3>
          <p className="text-muted-foreground mb-6">Join RiggerHub today and connect with top employers across WA.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-4 text-lg btn-glow hover-scale" asChild>
              <Link to="/profile">Create Your Profile</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg hover-scale" asChild>
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;