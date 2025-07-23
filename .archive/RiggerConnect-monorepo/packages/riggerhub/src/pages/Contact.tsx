import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, MessageSquare, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    urgency: "normal"
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", subject: "", message: "", urgency: "normal" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const supportOptions = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Get detailed help via email",
      contact: "support@riggerhub.com.au",
      response: "Within 4 hours",
      href: "mailto:support@riggerhub.com.au",
      color: "text-primary"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      description: "Speak directly with our team",
      contact: "+61 8 9123 4567",
      response: "Mon-Fri 8AM-6PM AWST",
      href: "tel:+61891234567",
      color: "text-success"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Chat",
      description: "Instant help when available",
      contact: "Available on platform",
      response: "Mon-Fri 9AM-5PM AWST",
      href: "#",
      color: "text-secondary"
    }
  ];

  const faqs = [
    {
      question: "How do I create my profile?",
      answer: "Visit the Profile page and complete the required fields including your qualifications and work history."
    },
    {
      question: "How are job matches determined?",
      answer: "Our AI system matches your skills, qualifications, location preferences, and availability with suitable job opportunities."
    },
    {
      question: "Is RiggerHub free to use?",
      answer: "Yes, creating a profile and applying for jobs is completely free for workers."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Get Support</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Our dedicated support team is here to help you make the most of RiggerHub. 
                Whether you need technical assistance or have questions about our services, we're ready to help.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Preferred Contact Method</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We offer multiple ways to get in touch. Select the option that works best for you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {supportOptions.map((option, index) => (
                <Card key={index} className="card-lift hover:shadow-lg transition-all duration-300 group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-accent flex items-center justify-center ${option.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {option.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{option.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{option.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Contact:</span>
                        <a 
                          href={option.href} 
                          className="text-primary hover:underline font-medium"
                        >
                          {option.contact}
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Response:</span>
                        <Badge variant="secondary" className="text-xs">
                          {option.response}
                        </Badge>
                      </div>
                    </div>
                    <Button className="w-full hover-scale" asChild>
                      <a href={option.href}>Contact Now</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Send us a Message</CardTitle>
                  <p className="text-muted-foreground text-center">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Brief description of your inquiry"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="urgency">Priority Level</Label>
                      <select
                        id="urgency"
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option value="low">Low - General inquiry</option>
                        <option value="normal">Normal - Standard support</option>
                        <option value="high">High - Urgent issue</option>
                        <option value="critical">Critical - Platform down</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please provide details about your inquiry..."
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full btn-glow hover-scale">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Quick answers to common questions about RiggerHub.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-border">
                  <CardHeader>
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary mt-1">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground pl-11">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Office Information */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-border">
                <CardContent className="pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                        <MapPin className="w-6 h-6 text-primary mr-2" />
                        Our Location
                      </h3>
                      <div className="space-y-3 text-muted-foreground">
                        <p>RiggerHub Head Office</p>
                        <p>Perth, Western Australia</p>
                        <p>Australia</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                        <Clock className="w-6 h-6 text-primary mr-2" />
                        Business Hours
                      </h3>
                      <div className="space-y-2 text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Monday - Friday:</span>
                          <span>8:00 AM - 6:00 PM AWST</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Saturday:</span>
                          <span>9:00 AM - 1:00 PM AWST</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sunday:</span>
                          <span>Closed</span>
                        </div>
                        <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                          <p className="text-sm text-primary font-medium">
                            Emergency support available 24/7 for critical platform issues.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;