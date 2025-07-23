import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

const Safety = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Safety Guidelines</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card p-6 rounded-lg border text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Safety First</h3>
              <p className="text-muted-foreground">All operations must prioritize worker safety above all else.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border text-center">
              <AlertTriangle className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Risk Assessment</h3>
              <p className="text-muted-foreground">Conduct thorough risk assessments before any rigging operation.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border text-center">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Compliance</h3>
              <p className="text-muted-foreground">Ensure all work meets Australian safety standards and regulations.</p>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Key Safety Requirements</h2>
            <div className="text-muted-foreground space-y-4">
              <p>All rigging professionals must maintain and comply with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Valid High Risk Work Licence (HRWL) for all rigging operations</li>
                <li>Current first aid certification and CPR training</li>
                <li>Proper use of personal protective equipment (PPE)</li>
                <li>Pre-operation equipment inspections and safety checks</li>
                <li>Clear communication protocols during lifting operations</li>
                <li>Regular drug and alcohol testing compliance</li>
                <li>Site-specific safety inductions and training</li>
              </ul>
            </div>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">WorkSafe WA Compliance</h2>
            <div className="text-muted-foreground space-y-4">
              <p>RiggerHub operates in full compliance with WorkSafe Western Australia requirements:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All users must hold current WA-recognised qualifications</li>
                <li>Regular verification of licence and certification status</li>
                <li>Adherence to Australian Standards for rigging and lifting</li>
                <li>Mandatory reporting of workplace incidents and hazards</li>
                <li>Participation in ongoing professional development</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Personal Protective Equipment</h2>
            <div className="text-muted-foreground space-y-4">
              <p>Minimum PPE requirements for all rigging operations:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Safety helmet with chin strap</li>
                <li>High-visibility safety vest or shirt</li>
                <li>Safety boots with steel toe caps</li>
                <li>Safety glasses or face shields when required</li>
                <li>Cut-resistant gloves appropriate for the task</li>
                <li>Fall arrest harness for work at heights</li>
                <li>Hearing protection in high-noise environments</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Risk Assessment Procedures</h2>
            <p className="text-muted-foreground mb-4">
              Before commencing any rigging operation, conduct a comprehensive risk assessment including:
            </p>
            <div className="text-muted-foreground space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li>Load weight, dimensions, and center of gravity determination</li>
                <li>Selection of appropriate rigging equipment and techniques</li>
                <li>Assessment of environmental conditions (wind, weather, ground conditions)</li>
                <li>Identification of overhead hazards and clearance requirements</li>
                <li>Establishment of exclusion zones and access control</li>
                <li>Communication plan and emergency response procedures</li>
              </ul>
            </div>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Emergency Procedures</h2>
            <div className="text-muted-foreground space-y-4">
              <p>All workers must be familiar with site-specific emergency procedures:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Immediate stop work procedures for unsafe conditions</li>
                <li>Emergency evacuation routes and assembly points</li>
                <li>First aid response and medical emergency contacts</li>
                <li>Incident reporting requirements and procedures</li>
                <li>Emergency contact numbers for site management</li>
              </ul>
              
              <div className="bg-card p-6 rounded-lg border border-warning/20 mt-6">
                <h3 className="font-semibold text-foreground mb-3">Emergency Contacts</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Emergency Services:</strong> 000</p>
                  <p><strong>WorkSafe WA:</strong> 1300 307 877</p>
                  <p><strong>RiggerHub Safety Hotline:</strong> +61 8 9123 4567</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Continuous Improvement</h2>
            <p className="text-muted-foreground mb-4">
              RiggerHub is committed to continuous safety improvement through regular training updates, 
              incident analysis, and adoption of best practices across the Western Australian rigging industry.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Safety;