import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-8 text-lg">
              Last updated: December 2024. Welcome to RiggerHub. These terms and conditions outline the rules and regulations for the use of our platform and services.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using RiggerHub, you accept and agree to be bound by these terms. If you do not agree to these terms, please do not use our platform.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Platform Purpose</h2>
            <div className="text-muted-foreground space-y-4">
              <p>RiggerHub is designed to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Connect qualified rigging professionals with employment opportunities</li>
                <li>Facilitate qualification verification and compliance</li>
                <li>Support the broader Rigger Project ecosystem</li>
                <li>Contribute to ChaseWhiteRabbit NGO through ethical business practices</li>
              </ul>
            </div>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">User Responsibilities</h2>
            <div className="text-muted-foreground space-y-4">
              <p>As a platform user, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and up-to-date qualification information</li>
                <li>Maintain current safety certifications and licences</li>
                <li>Adhere to all applicable safety standards and regulations</li>
                <li>Use the platform for legitimate employment purposes only</li>
                <li>Respect the rights and safety of other users</li>
                <li>Comply with all applicable Australian laws and regulations</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Qualification Verification</h2>
            <p className="text-muted-foreground mb-4">
              Users are responsible for ensuring all uploaded qualifications are genuine, current, and accurately represented. 
              RiggerHub reserves the right to verify qualifications with issuing authorities and may suspend accounts with 
              fraudulent or expired certifications.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Safety and Compliance</h2>
            <div className="text-muted-foreground space-y-4">
              <p>All users must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintain valid safety certifications required for their roles</li>
                <li>Follow WorkSafe WA guidelines and regulations</li>
                <li>Report any safety concerns or incidents immediately</li>
                <li>Participate in ongoing safety training as required</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              RiggerHub serves as a platform connecting workers and employers. We do not guarantee employment outcomes 
              and are not liable for workplace incidents, contract disputes, or employment-related issues.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Termination</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to suspend or terminate accounts that violate these terms, provide false information, 
              or engage in unsafe practices.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Contact Information</h2>
            <div className="text-muted-foreground">
              <p className="mb-4">For questions regarding these terms:</p>
              <div className="bg-card p-4 rounded-lg border">
                <p><strong>Email:</strong> legal@riggerhub.com.au</p>
                <p><strong>Phone:</strong> +61 8 9123 4567</p>
                <p><strong>Address:</strong> RiggerHub Legal Team, Perth, WA</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;