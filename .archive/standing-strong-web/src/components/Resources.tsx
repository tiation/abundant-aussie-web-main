
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Phone, MapPin, Clock, Filter } from 'lucide-react';

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Mental Health', 'Housing', 'Employment', 'Healthcare', 'Legal', 'Emergency'];

  const resources = [
    {
      title: "Mental Health Emergency Line",
      category: "Mental Health",
      type: "Emergency",
      description: "24/7 crisis support and emergency mental health assistance",
      phone: "13 11 14",
      hours: "24/7",
      website: "lifeline.org.au",
      location: "Australia-wide"
    },
    {
      title: "Perth Mental Health Services", 
      category: "Mental Health",
      type: "Healthcare",
      description: "Comprehensive mental health services including assessment and treatment",
      phone: "(08) 9224 8888",
      hours: "Mon-Fri 8:30am-5:00pm",
      website: "nmhspublic.health.wa.gov.au",
      location: "Perth, WA"
    },
    {
      title: "Department of Communities - Housing",
      category: "Housing", 
      type: "Government",
      description: "Social housing applications and housing assistance programs",
      phone: "(08) 6551 8800",
      hours: "Mon-Fri 8:00am-5:00pm", 
      website: "communities.wa.gov.au",
      location: "WA State-wide"
    },
    {
      title: "NDIS Local Area Coordination",
      category: "Healthcare",
      type: "Support",
      description: "Help connecting with NDIS services and community supports",
      phone: "1800 800 110",
      hours: "Mon-Fri 8:00am-8:00pm",
      website: "ndis.gov.au", 
      location: "Australia-wide"
    },
    {
      title: "Legal Aid WA",
      category: "Legal",
      type: "Legal",
      description: "Free legal advice and representation for eligible individuals",
      phone: "1300 650 579",
      hours: "Mon-Fri 9:00am-4:00pm",
      website: "legalaid.wa.gov.au",
      location: "Perth & Regional WA"
    },
    {
      title: "Centrelink",
      category: "Employment", 
      type: "Government",
      description: "Income support, disability support pension, and employment services",
      phone: "132 717",
      hours: "Mon-Fri 8:00am-5:00pm",
      website: "servicesaustralia.gov.au",
      location: "Australia-wide"
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Emergency': return 'bg-red-100 text-red-800';
      case 'Healthcare': return 'bg-blue-100 text-blue-800';
      case 'Government': return 'bg-green-100 text-green-800';
      case 'Support': return 'bg-purple-100 text-purple-800';
      case 'Legal': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="resources" className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Support Resources Directory
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access a comprehensive directory of support services, emergency contacts, 
            and community resources available in Perth and across Australia.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search resources, services, or keywords..."
                  className="pl-10 border-blue-200 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-500">Filter:</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "gradient-bg text-white" : "border-blue-200 text-blue-700 hover:bg-blue-50"}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {filteredResources.map((resource, index) => (
            <Card key={index} className="p-6 bg-white border-blue-100 hover:shadow-lg transition-all-smooth">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">{resource.title}</h3>
                <Badge className={`ml-2 ${getTypeColor(resource.type)}`}>
                  {resource.type}
                </Badge>
              </div>
              
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{resource.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                  <span className="font-medium text-blue-700">{resource.phone}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">{resource.hours}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">{resource.location}</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Website
              </Button>
            </Card>
          ))}
        </div>

        {/* Emergency Notice */}
        <div className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Card className="p-8 bg-red-50 border-red-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-red-900 mb-4">Emergency Support</h3>
              <p className="text-red-800 mb-6">
                If you or someone you know is in immediate danger or experiencing a mental health crisis, 
                please contact emergency services immediately.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Emergency: 000
                </Button>
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                  Lifeline: 13 11 14
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Resources;
