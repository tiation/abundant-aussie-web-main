import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-8 text-lg">
              Last updated: December 2024. At RiggerHub, we are committed to protecting your privacy and ensuring the security of your personal information in accordance with Australian privacy laws.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Information We Collect</h2>
            <div className="text-muted-foreground space-y-4">
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal details (name, contact information, location)</li>
                <li>Professional qualifications and certifications</li>
                <li>Work history and experience records</li>
                <li>Safety training documentation</li>
                <li>Account preferences and communication settings</li>
              </ul>
            </div>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">How We Use Your Information</h2>
            <div className="text-muted-foreground space-y-4">
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide job matching and recruitment services</li>
                <li>Verify qualifications and ensure compliance</li>
                <li>Communicate about relevant opportunities</li>
                <li>Maintain platform security and safety</li>
                <li>Support the ChaseWhiteRabbit NGO through ethical data practices</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement industry-standard security measures to protect your data, including encryption, 
              secure storage, and regular security audits. Your qualification documents are stored securely 
              and only shared with potential employers with your explicit consent.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Your Rights</h2>
            <div className="text-muted-foreground space-y-4">
              <p>Under Australian privacy law, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of communications</li>
                <li>Lodge complaints with privacy authorities</li>
              </ul>
            </div>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Contact Us</h2>
            <div className="text-muted-foreground">
              <p className="mb-4">
                If you have questions about this Privacy Policy or wish to exercise your privacy rights:
              </p>
              <div className="bg-card p-4 rounded-lg border">
                <p><strong>Email:</strong> privacy@riggerhub.com.au</p>
                <p><strong>Phone:</strong> +61 8 9123 4567</p>
                <p><strong>Address:</strong> RiggerHub Privacy Officer, Perth, WA</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;