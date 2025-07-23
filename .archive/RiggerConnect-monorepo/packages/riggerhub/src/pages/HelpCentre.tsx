import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  HelpCircle, 
  Search, 
  Book, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock,
  ChevronRight,
  Star,
  FileText,
  Users,
  Settings,
  Shield,
  Briefcase,
  Award
} from "lucide-react";

const HelpCentre = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const handleContactSupport = () => {
    toast({
      title: "Redirecting to Support",
      description: "Opening contact support form...",
    });
  };

  const faqCategories = [
    {
      title: "Getting Started",
      icon: Users,
      color: "bg-blue-500",
      articles: [
        "How to create your professional profile",
        "Uploading and managing qualifications",
        "Setting up job alerts and preferences",
        "Understanding WA industry requirements"
      ]
    },
    {
      title: "Jobs & Applications", 
      icon: Briefcase,
      color: "bg-green-500",
      articles: [
        "How to search and apply for positions",
        "Understanding job requirements and rates",
        "Direct company communication process",
        "Interview preparation and tips"
      ]
    },
    {
      title: "Qualifications & Certifications",
      icon: Award,
      color: "bg-orange-500", 
      articles: [
        "Required certifications for WA sites",
        "High Risk Work Licence renewals",
        "Medical and fitness requirements",
        "Training provider recommendations"
      ]
    },
    {
      title: "Account & Settings",
      icon: Settings,
      color: "bg-purple-500",
      articles: [
        "Managing account settings and preferences",
        "Privacy and data protection",
        "Notification and alert settings",
        "Profile visibility and privacy controls"
      ]
    }
  ];

  const popularArticles = [
    {
      title: "Complete Guide to WA Mining & Construction Jobs",
      description: "Everything you need to know about working in Western Australia's resources sector",
      readTime: "8 min read",
      rating: 4.9,
      views: "12.5K"
    },
    {
      title: "High Risk Work Licence Requirements 2024",
      description: "Updated requirements and renewal processes for HRWL in Western Australia",
      readTime: "5 min read", 
      rating: 4.8,
      views: "8.2K"
    },
    {
      title: "Maximizing Your Profile for Better Job Matches",
      description: "Professional tips to optimize your profile and stand out to employers",
      readTime: "6 min read",
      rating: 4.7,
      views: "6.8K"
    }
  ];

  const quickActions = [
    {
      title: "Contact Support Team",
      description: "Get personalized help from our expert support team",
      icon: MessageCircle,
      action: () => window.location.href = '/contact-support'
    },
    {
      title: "Submit Feedback",
      description: "Help us improve RiggerHub with your suggestions",
      icon: Star,
      action: () => toast({ title: "Feedback", description: "Feedback form will open soon." })
    },
    {
      title: "Report an Issue", 
      description: "Technical problems or bugs? Let us know immediately",
      icon: Shield,
      action: () => window.location.href = '/contact-support'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Help Centre</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers, guides, and resources to help you succeed in Western Australia's construction, mining, and resources industries.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for help articles, guides, or FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                  <action.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular Articles */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular Articles</h2>
            <Badge variant="secondary">Most Helpful</Badge>
          </div>
          <div className="grid gap-6">
            {popularArticles.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 hover:text-primary cursor-pointer">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{article.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{article.rating}</span>
                        </div>
                        <span>{article.views} views</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground ml-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`${category.color} p-2 rounded-lg`}>
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle>{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex} className="flex items-center space-x-2 text-sm hover:text-primary cursor-pointer">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span>{article}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support CTA */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Still Need Help?</h3>
            <p className="text-muted-foreground mb-6">
              Our expert support team is here to help you succeed. Get personalized assistance with your account, applications, or technical issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => window.location.href = '/contact-support'}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" size="lg">
                <Phone className="w-4 h-4 mr-2" />
                Call +61 8 9123 4567
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCentre;