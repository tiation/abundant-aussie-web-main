import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">RH</span>
              </div>
              <span className="text-xl font-bold text-foreground">RiggerHub</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Connecting skilled riggers, doggers, and crane operators with premier construction, 
              mining, and resources companies across Western Australia.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <Heart className="w-4 h-4 text-secondary" />
              <span>Proudly supporting</span>
              <Link to="/about" className="text-primary hover:underline font-medium">ChaseWhiteRabbit NGO</Link>
            </div>
            <p className="text-xs text-muted-foreground">
              Part of the Rigger Project - Building careers while making a difference.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">For Workers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="text-muted-foreground hover:text-primary transition-colors">Find Jobs</Link></li>
              <li><Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">Create Profile</Link></li>
              <li><Link to="/qualifications" className="text-muted-foreground hover:text-primary transition-colors">Upload Qualifications</Link></li>
              <li><Link to="/jobs" className="text-muted-foreground hover:text-primary transition-colors">Career Resources</Link></li>
              <li><Link to="/safety" className="text-muted-foreground hover:text-primary transition-colors">Safety Guidelines</Link></li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help-centre" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/contact-support" className="text-muted-foreground hover:text-primary transition-colors">Contact Support</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/compliance" className="text-muted-foreground hover:text-primary transition-colors">Compliance</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center space-x-3 text-sm">
            <div className="bg-accent p-2 rounded-lg">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-medium text-foreground">Email Support</div>
              <a href="mailto:support@riggerhub.com.au" className="text-muted-foreground hover:text-primary">
                support@riggerhub.com.au
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <div className="bg-accent p-2 rounded-lg">
              <Phone className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-medium text-foreground">Phone Support</div>
              <a href="tel:+61891234567" className="text-muted-foreground hover:text-primary">
                +61 8 9123 4567
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <div className="bg-accent p-2 rounded-lg">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-medium text-foreground">Head Office</div>
              <span className="text-muted-foreground">Perth, Western Australia</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div>
            © 2024 RiggerHub. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-secondary" />
            <span>in Western Australia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;