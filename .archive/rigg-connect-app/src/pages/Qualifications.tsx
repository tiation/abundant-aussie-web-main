import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Upload, 
  FileText, 
  Download, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Search,
  ExternalLink
} from "lucide-react";

const Qualifications = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    qualificationName: "",
    certificateNumber: "",
    issuingAuthority: "",
    expiryDate: ""
  });

  const handleDownload = (qualName: string) => {
    toast({
      title: "Download Certificate",
      description: `Downloading certificate for ${qualName}...`,
    });
  };

  const handleRenew = (qualName: string) => {
    toast({
      title: "Renew Qualification",
      description: `Redirecting to renewal process for ${qualName}...`,
    });
  };

  const handleFindTraining = () => {
    window.location.href = '/find-training';
  };

  const handleLearnMore = (qualName: string) => {
    toast({
      title: "Learn More",
      description: `Opening detailed information for ${qualName}...`,
    });
  };

  const handleUploadCertificate = () => {
    toast({
      title: "Upload Certificate",
      description: "File upload feature will be available soon.",
    });
  };

  const handleSaveQualification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.qualificationName || !formData.certificateNumber || !formData.issuingAuthority || !formData.expiryDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Qualification Saved",
      description: `${formData.qualificationName} has been added to your profile.`,
    });
    
    // Reset form
    setFormData({
      qualificationName: "",
      certificateNumber: "",
      issuingAuthority: "",
      expiryDate: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const currentQuals = [
    { 
      name: "High Risk Work Licence - Rigging", 
      number: "HRWL123456", 
      status: "Current", 
      expires: "2025-03-15",
      issuer: "SafeWork SA"
    },
    { 
      name: "Rigging Intermediate", 
      number: "RI789123", 
      status: "Current", 
      expires: "2024-12-10",
      issuer: "TAFE WA"
    },
    { 
      name: "Working at Heights", 
      number: "WAH456789", 
      status: "Current", 
      expires: "2025-01-20",
      issuer: "RTO Training"
    }
  ];

  const expiringQuals = [
    { 
      name: "First Aid Certificate", 
      number: "FA321654", 
      status: "Expires Soon", 
      expires: "2024-08-30",
      issuer: "Red Cross"
    },
    { 
      name: "CPR Certificate", 
      number: "CPR987321", 
      status: "Expires Soon", 
      expires: "2024-09-15",
      issuer: "St John Ambulance"
    }
  ];

  const requiredQuals = [
    "High Risk Work Licence - Dogging",
    "Crane Operator Licence", 
    "EWP (Elevated Work Platform)",
    "Confined Space Entry",
    "Gas Test Atmospheres"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Qualifications & Certifications</h1>
          <p className="text-muted-foreground">Manage your qualifications, track expiry dates, and discover new certification opportunities.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button 
            className="h-16 flex-col space-y-2"
            onClick={handleUploadCertificate}
          >
            <Upload className="w-5 h-5" />
            <span>Upload Certificate</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 flex-col space-y-2"
            onClick={() => handleFindTraining()}
          >
            <Search className="w-5 h-5" />
            <span>Find Training</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 flex-col space-y-2"
            onClick={() => window.location.href = '/set-reminders'}
          >
            <Calendar className="w-5 h-5" />
            <span>Set Reminders</span>
          </Button>
        </div>

        {/* Qualification Tabs */}
        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="current">Current ({currentQuals.length})</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Soon ({expiringQuals.length})</TabsTrigger>
            <TabsTrigger value="needed">Recommended</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Current Qualifications</h2>
              <Badge variant="default" className="bg-success">
                {currentQuals.length} Active
              </Badge>
            </div>
            
            <div className="grid gap-4">
              {currentQuals.map((qual, index) => (
                <Card key={index} className="border-success/20">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="bg-success/10 p-2 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-success" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{qual.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Certificate #{qual.number} • {qual.issuer}
                          </p>
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>Expires: {qual.expires}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(qual.name)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Badge variant="default" className="bg-success">
                          {qual.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="expiring" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Expiring Soon</h2>
              <Badge variant="destructive">
                Action Required
              </Badge>
            </div>
            
            <div className="grid gap-4">
              {expiringQuals.map((qual, index) => (
                <Card key={index} className="border-warning/20">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="bg-warning/10 p-2 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-warning" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{qual.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Certificate #{qual.number} • {qual.issuer}
                          </p>
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="w-4 h-4 text-warning" />
                            <span className="text-warning font-medium">Expires: {qual.expires}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          onClick={() => handleRenew(qual.name)}
                        >
                          Renew Now
                        </Button>
                        <Badge variant="destructive">
                          {qual.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="needed" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recommended Qualifications</h2>
              <Badge variant="outline">
                Expand Your Skills
              </Badge>
            </div>
            
            <p className="text-muted-foreground mb-6">
              These additional qualifications could unlock new job opportunities and higher pay rates.
            </p>
            
            <div className="grid gap-4">
              {requiredQuals.map((qual, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="bg-accent p-2 rounded-lg">
                          <Plus className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{qual}</h3>
                          <p className="text-sm text-muted-foreground">High demand in WA market</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.location.href = '/find-training'}
                        >
                          Find Training
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleLearnMore(qual)}
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Upload New Qualification</h2>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Add Certificate or Licence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Certificate</h3>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop your certificate files here, or click to browse
                  </p>
                  <Button onClick={handleUploadCertificate}>
                    Choose Files
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Supported formats: PDF, JPG, PNG (Max 10MB)
                  </p>
                </div>
                
                <form onSubmit={handleSaveQualification} className="space-y-4">
                  <h4 className="font-medium">Certificate Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="qualificationName">
                        Qualification Name *
                      </Label>
                      <Input 
                        id="qualificationName"
                        type="text" 
                        value={formData.qualificationName}
                        onChange={(e) => handleInputChange("qualificationName", e.target.value)}
                        placeholder="e.g., High Risk Work Licence"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="certificateNumber">
                        Certificate Number *
                      </Label>
                      <Input 
                        id="certificateNumber"
                        type="text" 
                        value={formData.certificateNumber}
                        onChange={(e) => handleInputChange("certificateNumber", e.target.value)}
                        placeholder="e.g., HRWL123456"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="issuingAuthority">
                        Issuing Authority *
                      </Label>
                      <Input 
                        id="issuingAuthority"
                        type="text" 
                        value={formData.issuingAuthority}
                        onChange={(e) => handleInputChange("issuingAuthority", e.target.value)}
                        placeholder="e.g., SafeWork SA"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiryDate">
                        Expiry Date *
                      </Label>
                      <Input 
                        id="expiryDate"
                        type="date" 
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Save Qualification
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Qualifications;