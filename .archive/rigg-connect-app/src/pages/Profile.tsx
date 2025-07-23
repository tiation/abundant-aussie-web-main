import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedCard from "@/components/AnimatedCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  FileText, 
  Briefcase,
  Edit,
  Upload,
  ExternalLink,
  Building,
  Clock
} from "lucide-react";

const Profile = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          toast({
            title: "Profile Load Error",
            description: "Unable to load profile data. Please try again.",
            variant: "destructive",
          });
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, toast]);

  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "Profile editing functionality will be available soon.",
    });
  };

  const handleUploadQualification = () => {
    navigate('/qualifications');
  };

  const handleSettingsAction = (action: string) => {
    toast({
      title: action,
      description: "This feature will be available in the next update.",
    });
  };

  // Loading states
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Breadcrumbs />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get user data with fallbacks
  const userProfile = {
    name: profile?.full_name || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    phone: profile?.phone || 'Not provided',
    location: profile?.location || 'Not specified',
    company: profile?.company || 'Not specified',
    position: profile?.position || 'Not specified',
    experience: profile?.experience_years ? `${profile.experience_years} years` : 'Not specified',
    bio: profile?.bio || 'No bio provided',
    status: "Available"
  };

  const qualifications = [
    { name: "High Risk Work Licence", status: "Current", expires: "2025-03-15" },
    { name: "Rigging Intermediate", status: "Current", expires: "2024-12-10" },
    { name: "Working at Heights", status: "Current", expires: "2025-01-20" },
    { name: "First Aid Certificate", status: "Expires Soon", expires: "2024-08-30" }
  ];

  const workHistory = [
    {
      company: userProfile.company !== 'Not specified' ? userProfile.company : "Rio Tinto",
      position: userProfile.position !== 'Not specified' ? userProfile.position : "Senior Rigger",
      duration: "2022 - 2024",
      project: "Iron Ore Expansion Project",
      location: userProfile.location !== 'Not specified' ? userProfile.location : "Pilbara, WA"
    },
    {
      company: "Fortescue Metals",
      position: "Rigger",
      duration: "2020 - 2022",
      project: "Solomon Hub Operations", 
      location: "Pilbara, WA"
    },
    {
      company: "BHP",
      position: "Junior Rigger",
      duration: "2018 - 2020",
      project: "Port Hedland Operations",
      location: "Port Hedland, WA"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs />
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <AnimatedCard className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24 hover-scale">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2 font-display">{userProfile.name}</h1>
                    <p className="text-lg text-muted-foreground mb-2">{userProfile.position}</p>
                    <Badge variant="secondary" className="mb-4 animate-pulse-scale">{userProfile.status}</Badge>
                  </div>
                  <Button onClick={handleEditProfile} className="mt-4 md:mt-0 btn-glow hover-scale">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{userProfile.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{userProfile.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{userProfile.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span>{userProfile.company}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{userProfile.experience} experience</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Profile Tabs */}
        <Tabs defaultValue="qualifications" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
            <TabsTrigger value="experience">Work History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="qualifications" className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Qualifications & Certifications</h2>
              <Link to="/qualifications">
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Manage Qualifications
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="grid gap-4">
              {qualifications.map((qual, index) => (
                <AnimatedCard key={index} delay={`${index * 0.1}s`}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className="bg-accent p-2 rounded-lg hover-scale">
                          <Award className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{qual.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="w-4 h-4" />
                            <span>Expires: {qual.expires}</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={qual.status === "Current" ? "default" : "destructive"}
                        className={qual.status === "Current" ? "bg-success" : ""}
                      >
                        {qual.status}
                      </Badge>
                    </div>
                  </CardContent>
                </AnimatedCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experience" className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold">Work History</h2>
            
            <div className="space-y-4">
              {workHistory.map((job, index) => (
                <AnimatedCard key={index} delay={`${index * 0.1}s`}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg font-display">{job.position}</h3>
                        <p className="text-primary font-medium">{job.company}</p>
                        <p className="text-muted-foreground">{job.project}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{job.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </AnimatedCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold">Profile Settings</h2>
            
            <div className="grid gap-6">
              <AnimatedCard delay="0.1s">
                <CardHeader>
                  <CardTitle className="font-display">Availability Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover-scale"
                    onClick={() => handleSettingsAction("Update Availability Status")}
                  >
                    Update Availability Status
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover-scale"
                    onClick={() => handleSettingsAction("Set Location Preferences")}
                  >
                    Set Location Preferences
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover-scale"
                    onClick={() => handleSettingsAction("Configure Job Alerts")}
                  >
                    Configure Job Alerts
                  </Button>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard delay="0.2s">
                <CardHeader>
                  <CardTitle className="font-display">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover-scale"
                    onClick={() => handleSettingsAction("Change Password")}
                  >
                    Change Password
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover-scale"
                    onClick={() => handleSettingsAction("Update Contact Information")}
                  >
                    Update Contact Information
                  </Button>
                  <Link to="/privacy" className="block">
                    <Button variant="outline" className="w-full justify-start hover-scale">
                      Privacy Settings
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </AnimatedCard>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;