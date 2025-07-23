import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Users,
  Building,
  Award,
  HardHat,
  Scale,
  Eye,
  Phone,
  Mail,
  ExternalLink,
  Clock,
  Zap
} from "lucide-react";

const Compliance = () => {
  const lastUpdated = "January 15, 2024";

  const complianceFrameworks = [
    {
      title: "Australian Privacy Principles (APP)",
      description: "Full compliance with Privacy Act 1988 and Australian privacy regulations",
      status: "Certified",
      icon: Shield,
      details: [
        "Data minimization and purpose limitation",
        "Transparent data collection practices",
        "Secure data storage and transmission",
        "User rights and access controls"
      ]
    },
    {
      title: "Fair Work Act 2009",
      description: "Adherence to Australian employment law and workplace standards",
      status: "Compliant",
      icon: Scale,
      details: [
        "Equal opportunity employment practices",
        "Workplace rights and obligations",
        "Modern award compliance guidance",
        "Anti-discrimination policies"
      ]
    },
    {
      title: "Work Health & Safety Act 2020 (WA)",
      description: "Compliance with Western Australian workplace safety requirements",
      status: "Verified",
      icon: HardHat,
      details: [
        "High Risk Work Licence verification",
        "Safety training and certification tracking",
        "Incident reporting protocols",
        "Continuous safety monitoring"
      ]
    },
    {
      title: "ISO 27001 Information Security",
      description: "International standard for information security management",
      status: "In Progress",
      icon: Eye,
      details: [
        "Risk assessment and management",
        "Security incident response",
        "Access control and monitoring",
        "Regular security audits"
      ]
    }
  ];

  const certifications = [
    {
      category: "Data Protection",
      items: [
        "GDPR Compliance Framework",
        "Australian Privacy Principles (APP)",
        "Cyber Security Framework (ISM)",
        "Data Breach Response Protocol"
      ]
    },
    {
      category: "Industry Standards",
      items: [
        "Safe Work Australia Guidelines",
        "Construction Industry Standards",
        "Mining Safety Regulations",
        "Resources Sector Compliance"
      ]
    },
    {
      category: "Business Operations",
      items: [
        "Australian Business License",
        "Fair Trading Compliance",
        "Consumer Protection Framework",
        "Electronic Transactions Act"
      ]
    }
  ];

  const auditResults = [
    {
      date: "December 2023",
      type: "Security Audit",
      result: "Pass",
      score: "98%",
      auditor: "CyberCX Australia"
    },
    {
      date: "November 2023",
      type: "Privacy Compliance",
      result: "Pass",
      score: "96%",
      auditor: "OAIC Assessment"
    },
    {
      date: "October 2023",
      type: "Safety Standards",
      result: "Pass",
      score: "100%",
      auditor: "WorkSafe WA"
    }
  ];

  const riskManagement = [
    {
      category: "Data Security",
      measures: [
        "End-to-end encryption for all data transmission",
        "Multi-factor authentication for all accounts",
        "Regular penetration testing and vulnerability assessments",
        "24/7 security monitoring and incident response"
      ]
    },
    {
      category: "Operational Risk",
      measures: [
        "Business continuity and disaster recovery plans",
        "Service level agreements with 99.9% uptime guarantee",
        "Regular backup and recovery testing",
        "Comprehensive insurance coverage"
      ]
    },
    {
      category: "Compliance Risk",
      measures: [
        "Automated compliance monitoring systems",
        "Regular legal and regulatory updates",
        "Staff training on compliance requirements",
        "Third-party compliance audits"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Compliance & Standards</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-4">
            RiggerHub maintains the highest standards of compliance across data protection, employment law, 
            workplace safety, and industry regulations. Our comprehensive compliance framework ensures trust, 
            security, and legal adherence in all operations.
          </p>
          <Badge variant="outline" className="text-sm">
            <Clock className="w-4 h-4 mr-1" />
            Last updated: {lastUpdated}
          </Badge>
        </div>

        {/* Compliance Status Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Compliance Framework Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceFrameworks.map((framework, index) => (
              <Card key={index} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <framework.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{framework.title}</CardTitle>
                        <Badge 
                          variant={framework.status === "Certified" ? "default" : 
                                 framework.status === "Compliant" ? "secondary" : 
                                 framework.status === "Verified" ? "default" : "outline"}
                          className={framework.status === "Certified" ? "bg-green-500" :
                                   framework.status === "Compliant" ? "bg-blue-500" :
                                   framework.status === "Verified" ? "bg-green-500" : ""}
                        >
                          {framework.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{framework.description}</p>
                  <ul className="space-y-1">
                    {framework.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications & Standards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Certifications & Standards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{cert.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {cert.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2 text-sm">
                        <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Audit Results */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Independent Audit Results</h2>
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Audit Type</th>
                      <th className="text-left py-3 px-4">Result</th>
                      <th className="text-left py-3 px-4">Score</th>
                      <th className="text-left py-3 px-4">Auditor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditResults.map((audit, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4 text-sm">{audit.date}</td>
                        <td className="py-3 px-4 text-sm">{audit.type}</td>
                        <td className="py-3 px-4">
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {audit.result}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">{audit.score}</td>
                        <td className="py-3 px-4 text-sm">{audit.auditor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Management */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Risk Management & Controls</h2>
          <div className="space-y-6">
            {riskManagement.map((risk, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <span>{risk.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {risk.measures.map((measure, measureIndex) => (
                      <div key={measureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{measure}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Industry Compliance */}
        <Card className="mb-12 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-900">
              <Building className="w-5 h-5" />
              <span>Western Australia Industry Compliance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Mining & Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Department of Mines compliance</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Resources Safety regulations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Environmental protection standards</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Construction & Infrastructure</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Building and Construction Authority</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>WorkSafe WA requirements</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Australian Standards compliance</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Reporting */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Compliance Reporting & Transparency</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-3">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Real-time Monitoring</h3>
                <p className="text-sm text-muted-foreground">
                  Continuous monitoring of compliance metrics with automated alerts for any deviations.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Regular Reporting</h3>
                <p className="text-sm text-muted-foreground">
                  Quarterly compliance reports available to stakeholders and regulatory bodies.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-3">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Stakeholder Access</h3>
                <p className="text-sm text-muted-foreground">
                  Transparent access to compliance status for users, employers, and partners.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-4">Compliance Inquiries</h2>
            <p className="text-muted-foreground mb-6">
              For compliance-related questions, audit requests, or regulatory inquiries, 
              contact our compliance team directly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Compliance Officer</div>
                  <a href="mailto:compliance@riggerhub.com.au" className="text-sm text-muted-foreground hover:text-primary">
                    compliance@riggerhub.com.au
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Compliance Hotline</div>
                  <a href="tel:+61891234567" className="text-sm text-muted-foreground hover:text-primary">
                    +61 8 9123 4567
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" asChild>
                <a href="#" className="flex items-center">
                  Download Compliance Certificate
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Compliance;