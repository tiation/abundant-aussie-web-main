import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  MapPin,
  Send,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Headphones,
  Zap
} from "lucide-react";

const ContactSupport = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    priority: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Support Request Submitted",
      description: "We'll respond to your inquiry within 4 business hours. You'll receive a confirmation email shortly.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      priority: "",
      message: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const supportChannels = [
    {
      title: "Live Chat Support",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      action: "Start Chat",
      availability: "Mon-Fri, 7AM-7PM AWST",
      responseTime: "Immediate",
      color: "bg-green-500"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our experts",
      icon: Phone,
      action: "Call Now",
      availability: "Mon-Fri, 7AM-7PM AWST",
      responseTime: "Immediate",
      color: "bg-blue-500"
    },
    {
      title: "Email Support",
      description: "Detailed support via email",
      icon: Mail,
      action: "Send Email",
      availability: "24/7",
      responseTime: "Within 4 hours",
      color: "bg-purple-500"
    }
  ];

  const priorityLevels = [
    { value: "low", label: "Low - General inquiry", color: "text-green-600" },
    { value: "medium", label: "Medium - Account issue", color: "text-yellow-600" },
    { value: "high", label: "High - Application problem", color: "text-orange-600" },
    { value: "urgent", label: "Urgent - Critical system issue", color: "text-red-600" }
  ];

  const categories = [
    { value: "account", label: "Account & Profile" },
    { value: "jobs", label: "Jobs & Applications" },
    { value: "qualifications", label: "Qualifications & Certifications" },
    { value: "technical", label: "Technical Issues" },
    { value: "billing", label: "Billing & Payments" },
    { value: "feedback", label: "Feedback & Suggestions" },
    { value: "other", label: "Other" }
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
              <Headphones className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Contact Support</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our dedicated support team is here to help you succeed. Get expert assistance with your account, applications, qualifications, or any technical issues.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Support Channels */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-6">Get Help Instantly</h2>
            <div className="space-y-4">
              {supportChannels.map((channel, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`${channel.color} p-2 rounded-lg`}>
                        <channel.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{channel.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{channel.description}</p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{channel.availability}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap className="w-3 h-3" />
                            <span>{channel.responseTime}</span>
                          </div>
                        </div>
                        <Button size="sm" className="w-full mt-3">
                          {channel.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Direct Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Phone</div>
                    <a href="tel:+61891234567" className="text-sm text-muted-foreground hover:text-primary">
                      +61 8 9123 4567
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    <a href="mailto:support@riggerhub.com.au" className="text-sm text-muted-foreground hover:text-primary">
                      support@riggerhub.com.au
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Office</div>
                    <span className="text-sm text-muted-foreground">Perth, Western Australia</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Submit Support Request</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@company.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your inquiry"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        className="w-full p-2 border border-input rounded-md bg-background"
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority Level</Label>
                      <select
                        id="priority"
                        value={formData.priority}
                        onChange={(e) => handleInputChange("priority", e.target.value)}
                        className="w-full p-2 border border-input rounded-md bg-background"
                      >
                        <option value="">Select priority</option>
                        {priorityLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide detailed information about your inquiry. Include any error messages, steps you've taken, and what outcome you're expecting."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium text-blue-900 mb-1">Response Time Guarantee</div>
                        <div className="text-blue-700">
                          We guarantee a response within 4 business hours for all support requests. 
                          High and urgent priority requests are typically responded to within 1 hour.
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Support Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Common Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">How quickly will I get a response?</h4>
                  <p className="text-sm text-muted-foreground">
                    We respond to all support requests within 4 business hours, with urgent issues typically handled within 1 hour.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Can I track my support request?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, you'll receive a ticket number via email and can track progress through your account dashboard.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Do you offer phone support?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, phone support is available Monday-Friday, 7AM-7PM AWST for urgent matters and complex issues.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Is support available on weekends?</h4>
                  <p className="text-sm text-muted-foreground">
                    Email support is monitored 24/7. Critical system issues are addressed immediately, even on weekends.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactSupport;