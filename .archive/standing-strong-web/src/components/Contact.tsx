
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    newsletter: false
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Message Sent Successfully",
      description: "We'll get back to you within 24 hours. Thank you for reaching out!",
    });
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: '',
      newsletter: false
    });
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "0435 598 396",
      subtitle: "Mon-Fri 8:30am-5:00pm"
    },
    {
      icon: Mail,
      title: "Email", 
      details: "csndiscoaching@gmail.com",
      subtitle: "We respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Location",
      details: "Perth, Western Australia",
      subtitle: "Covering all of Perth WA"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Monday - Friday",
      subtitle: "8:30am - 5:00pm"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to start your journey? Contact us today for a confidential consultation 
            and learn how we can support you in achieving your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="animate-fade-in-up">
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-white border-blue-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-700">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1 border-blue-200 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1 border-blue-200 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1 border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="service" className="text-gray-700">Service of Interest</Label>
                    <Select onValueChange={(value) => handleInputChange('service', value)}>
                      <SelectTrigger className="mt-1 border-blue-200 focus:border-blue-500">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="support-coordination">Support Coordination</SelectItem>
                        <SelectItem value="recovery-coaching">Psychosocial Recovery Coaching</SelectItem>
                        <SelectItem value="ndis-navigation">NDIS Navigation Support</SelectItem>
                        <SelectItem value="general-inquiry">General Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-700">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={5}
                    className="mt-1 border-blue-200 focus:border-blue-500"
                    placeholder="Please tell us about your needs and how we can help..."
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={formData.newsletter}
                    onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                    className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="newsletter" className="text-sm text-gray-600">
                    I'd like to receive updates and resources via email
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-bg text-white hover:opacity-90 transition-opacity py-3"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-8">
              {contactInfo.map((info, index) => (
                <Card key={index} className="p-6 bg-white border-blue-100 hover:shadow-md transition-all-smooth">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{info.title}</h4>
                      <p className="text-blue-700 font-medium">{info.details}</p>
                      <p className="text-gray-600 text-sm">{info.subtitle}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Quick Contact Actions */}
            <div className="mt-8 space-y-4">
              <Card className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <h4 className="text-lg font-semibold mb-3">Need Immediate Support?</h4>
                <p className="mb-4 opacity-90">
                  Our team is ready to help. Call us directly or schedule a consultation.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="bg-white text-blue-700 hover:bg-gray-100 flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 flex-1">
                    Schedule Call
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="bg-blue-50 rounded-lg p-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Privacy & Confidentiality</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Confidential Consultations</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">NDIS Registered Provider</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Professional Standards</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
