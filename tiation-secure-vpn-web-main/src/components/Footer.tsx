
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-cyan-neon/10 rounded-lg">
                <Shield className="h-6 w-6 text-cyan-neon" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Gadtia VPN</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Protecting your digital freedom with military-grade security, 
              lightning-fast speeds, and unwavering commitment to privacy.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2 text-cyan-neon" />
                support@gadtiavpn.com
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-600 hover:text-cyan-neon transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-gray-600 hover:text-cyan-neon transition-colors">Pricing</a></li>
              <li><a href="#security" className="text-gray-600 hover:text-cyan-neon transition-colors">Security</a></li>
              <li><a href="#" className="text-gray-600 hover:text-cyan-neon transition-colors">Apps</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-cyan-neon transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-cyan-neon transition-colors">Setup Guides</a></li>
              <li><a href="#" className="text-gray-600 hover:text-cyan-neon transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-cyan-neon transition-colors">Server Status</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 Gadtia VPN. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-cyan-neon text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-cyan-neon text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-cyan-neon text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
