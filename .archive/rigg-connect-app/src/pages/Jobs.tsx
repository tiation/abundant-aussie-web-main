import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, DollarSign, Building, Filter, Search, Bookmark, Heart, Star, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const { toast } = useToast();

  const jobs = [
    {
      id: 1,
      title: "Senior Rigger - Mining Operation",
      company: "BHP Iron Ore",
      location: "Port Hedland, WA",
      salary: "$120,000 - $140,000",
      type: "Full-time",
      posted: "2 days ago",
      featured: true,
      urgent: false,
      description: "Experienced rigger required for major iron ore mining operation. Must have current WA tickets and 5+ years experience.",
      requirements: ["High Risk Work Licence", "Rigging Intermediate", "Mining experience", "Drug & Alcohol testing"],
      benefits: ["FIFO accommodation", "Medical insurance", "Annual bonus", "Training provided"],
      category: "rigger"
    },
    {
      id: 2,
      title: "Dogger - Construction Project",
      company: "Multiplex Construction",
      location: "Perth CBD, WA",
      salary: "$95,000 - $110,000",
      type: "Contract",
      posted: "1 week ago",
      featured: false,
      urgent: true,
      description: "Dogger needed for high-rise construction project in Perth CBD. 18-month contract with potential for extension.",
      requirements: ["Dogging Licence", "Construction experience", "Heights certification", "EWP ticket"],
      benefits: ["Flexible hours", "Parking provided", "Career progression", "Ongoing work"],
      category: "dogger"
    },
    {
      id: 3,
      title: "Crane Operator - Infrastructure",
      company: "CPB Contractors",
      location: "Kalgoorlie, WA",
      salary: "$130,000 - $150,000",
      type: "Full-time",
      posted: "3 days ago",
      featured: true,
      urgent: false,
      description: "Mobile crane operator for major infrastructure project. Excellent rates and FIFO arrangements available.",
      requirements: ["HC Licence", "Crane Operator Licence", "Infrastructure experience", "Clean driving record"],
      benefits: ["FIFO arrangements", "Tool allowance", "Overtime available", "Long-term project"],
      category: "crane-operator"
    },
    {
      id: 4,
      title: "Scaffolder - Oil & Gas",
      company: "Worley Limited",
      location: "Karratha, WA",
      salary: "$110,000 - $125,000",
      type: "Full-time",
      posted: "5 days ago",
      featured: false,
      urgent: false,
      description: "Experienced scaffolder for oil & gas facility maintenance. Great opportunity for career advancement.",
      requirements: ["Scaffolding Licence", "Working at Heights", "Gas industry experience", "Team player"],
      benefits: ["Remote location allowance", "Health benefits", "Professional development", "Safety bonus"],
      category: "scaffolder"
    },
    {
      id: 5,
      title: "Rigger/Dogger Combo - Mining",
      company: "Rio Tinto",
      location: "Tom Price, WA",
      salary: "$135,000 - $155,000",
      type: "Full-time",
      posted: "1 day ago",
      featured: true,
      urgent: true,
      description: "Dual qualified rigger/dogger for iron ore operations. Excellent package with comprehensive benefits.",
      requirements: ["Rigging Advanced", "Dogging Licence", "Mining experience", "Safety focus"],
      benefits: ["Premium FIFO", "Salary sacrifice", "Share scheme", "Training opportunities"],
      category: "rigger"
    }
  ];

  const handleSaveJob = (jobId: number) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(prev => prev.filter(id => id !== jobId));
      toast({
        title: "Job Unsaved",
        description: "Job removed from your saved list.",
      });
    } else {
      setSavedJobs(prev => [...prev, jobId]);
      toast({
        title: "Job Saved",
        description: "Job added to your saved list. View in your profile.",
      });
    }
  };

  const handleApply = (jobTitle: string) => {
    toast({
      title: "Application Started",
      description: `Redirecting to application form for ${jobTitle}...`,
    });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || selectedLocation === "all-locations" || job.location.includes(selectedLocation);
    const matchesType = !selectedType || selectedType === "all-types" || job.type === selectedType;
    return matchesSearch && matchesLocation && matchesType;
  });

  const jobStats = {
    total: jobs.length,
    new: jobs.filter(job => job.posted.includes('day')).length,
    featured: jobs.filter(job => job.featured).length,
    urgent: jobs.filter(job => job.urgent).length
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Next Job</h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Discover opportunities with top employers across Western Australia's construction, mining, and resources sectors.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{jobStats.total}</div>
                  <div className="text-white/80 text-sm">Total Jobs</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">{jobStats.new}</div>
                  <div className="text-white/80 text-sm">New Today</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-300">{jobStats.featured}</div>
                  <div className="text-white/80 text-sm">Featured</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-300">{jobStats.urgent}</div>
                  <div className="text-white/80 text-sm">Urgent</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Search & Filters */}
          <div className="mb-8">
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search jobs or companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-locations">All Locations</SelectItem>
                      <SelectItem value="Perth">Perth</SelectItem>
                      <SelectItem value="Port Hedland">Port Hedland</SelectItem>
                      <SelectItem value="Kalgoorlie">Kalgoorlie</SelectItem>
                      <SelectItem value="Karratha">Karratha</SelectItem>
                      <SelectItem value="Tom Price">Tom Price</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-types">All Types</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="hover-scale">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                    Rigger ({jobs.filter(j => j.category === 'rigger').length})
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                    Dogger ({jobs.filter(j => j.category === 'dogger').length})
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                    Crane Operator ({jobs.filter(j => j.category === 'crane-operator').length})
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                    Scaffolder ({jobs.filter(j => j.category === 'scaffolder').length})
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
              </h2>
              <p className="text-muted-foreground">
                Showing {filteredJobs.length} of {jobs.length} available positions
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select defaultValue="newest">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="salary-high">Salary (High)</SelectItem>
                  <SelectItem value="salary-low">Salary (Low)</SelectItem>
                  <SelectItem value="relevance">Relevance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Jobs List */}
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="card-lift hover:shadow-lg transition-all duration-300 group animate-fade-in relative">
                {/* Job badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {job.featured && (
                    <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {job.urgent && (
                    <Badge variant="destructive">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Urgent
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-4">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4 pr-24">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 hover:text-primary transition-colors cursor-pointer group-hover:text-primary">
                        {job.title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center space-x-1">
                          <Building className="w-4 h-4" />
                          <span className="font-medium">{job.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.posted}</span>
                        </div>
                      </div>
                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        <Badge variant="secondary">{job.type}</Badge>
                        <div className="flex items-center space-x-1 text-success font-semibold bg-success/10 px-3 py-1 rounded-full">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 min-w-[140px]">
                      <Button 
                        className="hover-scale btn-glow"
                        onClick={() => handleApply(job.title)}
                      >
                        Apply Now
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hover-scale"
                        onClick={() => handleSaveJob(job.id)}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${savedJobs.includes(job.id) ? 'fill-current text-red-500' : ''}`} />
                        {savedJobs.includes(job.id) ? 'Saved' : 'Save'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">Requirements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">Benefits:</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.benefits.map((benefit, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Match Score: <span className="text-primary font-medium">85%</span></span>
                      <span>•</span>
                      <span>23 applicants</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover">
                      View Details →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Jobs Found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any jobs matching your criteria. Try adjusting your search filters.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" onClick={() => {
                    setSearchTerm("");
                    setSelectedLocation("");
                    setSelectedType("");
                  }}>
                    Clear Filters
                  </Button>
                  <Button asChild>
                    <Link to="/profile">Complete Your Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Load More / Job Alerts */}
          {filteredJobs.length > 0 && (
            <div className="mt-12">
              <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardContent className="text-center py-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Stay Updated</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Get notified when new jobs matching your profile are posted. 
                    Set up job alerts to never miss an opportunity.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" className="hover-scale">
                      Load More Jobs
                    </Button>
                    <Button className="btn-glow hover-scale" asChild>
                      <Link to="/profile">Set Up Job Alerts</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;