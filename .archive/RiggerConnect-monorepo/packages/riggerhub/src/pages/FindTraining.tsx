import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Users, 
  ExternalLink,
  Filter,
  BookOpen,
  Award,
  DollarSign
} from "lucide-react";

const FindTraining = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const trainingProviders = [
    {
      name: "TAFE Western Australia",
      qualification: "High Risk Work Licence - Rigging",
      location: "Perth, Kalgoorlie, Port Hedland",
      duration: "3 days",
      price: "$450",
      rating: 4.8,
      students: "2,500+",
      nextStart: "2024-08-15",
      description: "Comprehensive rigging course covering basic to intermediate rigging techniques, safety protocols, and regulatory compliance.",
      features: ["Practical Hands-on Training", "Industry Certified Trainers", "Job Placement Assistance"]
    },
    {
      name: "RTO Safety Training",
      qualification: "Working at Heights",
      location: "Perth, Bunbury",
      duration: "1 day",
      price: "$280",
      rating: 4.6,
      students: "1,800+",
      nextStart: "2024-08-12",
      description: "Essential safety training for working at heights, covering fall protection systems and risk assessment.",
      features: ["Same Day Certification", "Small Class Sizes", "Equipment Provided"]
    },
    {
      name: "Mine Safety Institute",
      qualification: "Confined Space Entry",
      location: "Kalgoorlie, Newman",
      duration: "2 days",
      price: "$380",
      rating: 4.9,
      students: "950+",
      nextStart: "2024-08-20",
      description: "Specialized training for confined space entry procedures, gas testing, and emergency response protocols.",
      features: ["Mine Site Specific Training", "Gas Detection Equipment", "Emergency Simulation"]
    },
    {
      name: "Perth Skills Centre",
      qualification: "Crane Operator Licence",
      location: "Perth, Fremantle",
      duration: "5 days",
      price: "$890",
      rating: 4.7,
      students: "1,200+",
      nextStart: "2024-08-25",
      description: "Complete crane operator training including theory, practical operation, and safety procedures for various crane types.",
      features: ["Multiple Crane Types", "Theory & Practical", "High Pass Rate"]
    },
    {
      name: "Safety First Training",
      qualification: "First Aid & CPR",
      location: "Perth, Geraldton, Albany",
      duration: "1 day",
      price: "$120",
      rating: 4.5,
      students: "5,000+",
      nextStart: "2024-08-10",
      description: "Essential first aid and CPR training with nationally recognized certification valid for 3 years.",
      features: ["Nationally Recognized", "Weekend Classes", "Group Discounts"]
    },
    {
      name: "Advanced Rigging Academy",
      qualification: "Rigging Intermediate",
      location: "Perth, Port Hedland",
      duration: "4 days",
      price: "$650",
      rating: 4.8,
      students: "800+",
      nextStart: "2024-08-18",
      description: "Advanced rigging techniques for complex lifting operations in industrial and construction environments.",
      features: ["Advanced Techniques", "Industry Partnerships", "Career Support"]
    }
  ];

  const filteredProviders = trainingProviders.filter(provider => {
    const matchesSearch = !searchTerm || 
      provider.qualification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || 
      provider.location.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  const handleEnquire = (providerName: string, qualification: string) => {
    toast({
      title: "Enquiry Sent",
      description: `Your enquiry for ${qualification} at ${providerName} has been sent. They will contact you within 24 hours.`,
    });
  };

  const handleBookmark = (qualification: string) => {
    toast({
      title: "Bookmarked",
      description: `${qualification} has been saved to your training wishlist.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Find Training Providers</h1>
          <p className="text-muted-foreground">Discover accredited training providers for your next qualification in Western Australia.</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Search Qualifications</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="e.g., Rigging, First Aid, Crane"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="e.g., Perth, Kalgoorlie"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProviders.length} training providers
            {searchTerm && ` for "${searchTerm}"`}
            {selectedLocation && ` in ${selectedLocation}`}
          </p>
        </div>

        {/* Training Provider Results */}
        <div className="grid gap-6">
          {filteredProviders.map((provider, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{provider.qualification}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{provider.name}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{provider.rating}</span>
                        <span className="ml-1">({provider.students} students)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{provider.price}</div>
                    <div className="text-sm text-muted-foreground">{provider.duration}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{provider.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
                    <span>{provider.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                    <span>Next start: {provider.nextStart}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-muted-foreground mr-2" />
                    <span>{provider.students} graduates</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {provider.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button 
                    onClick={() => handleEnquire(provider.name, provider.qualification)}
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Send Enquiry
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleBookmark(provider.qualification)}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline">
                    <Award className="w-4 h-4 mr-2" />
                    Compare
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No training providers found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or browse all available courses.
              </p>
              <Button onClick={() => { setSearchTerm(""); setSelectedLocation(""); }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FindTraining;