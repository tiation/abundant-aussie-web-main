
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Shield, Mail, Phone, MapPin, Facebook, Linkedin, ArrowRight } from 'lucide-react';
import logoImage from '@/assets/coordination-support-logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">Stay Connected</h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get helpful resources, updates, and support tips delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <Input 
                placeholder="Enter your email address"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 flex-1"
              />
              <Button className="gradient-bg text-white hover:opacity-90 px-6">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={logoImage} 
                alt="Coordination & Support Logo" 
                className="h-12 w-auto"
              />
              <div>
                <span className="text-xl font-bold">Standing Strong</span>
                <div className="text-sm text-blue-400">Support Services</div>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Providing comprehensive support coordination and psychosocial recovery coaching 
              across Perth. Founded by Caleb Standing with lived experience and a commitment 
              to community impact.
            </p>
            
            <div className="flex items-center space-x-2 text-blue-400 mb-4">
              <Heart className="w-5 h-5" />
              <span className="text-sm">15% of income donated to mental health charities</span>
            </div>
            
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 p-2">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 p-2">
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              <li><a href="#services" className="text-gray-300 hover:text-blue-400 transition-colors">Support Coordination</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-blue-400 transition-colors">Recovery Coaching</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-blue-400 transition-colors">NDIS Navigation</a></li>
              <li><a href="#resources" className="text-gray-300 hover:text-blue-400 transition-colors">Resource Directory</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">0435 598 396</div>
                  <div className="text-gray-400 text-sm">Mon-Fri 8:30am-5:00pm</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <div className="text-white">csndiscoaching@gmail.com</div>
                  <div className="text-gray-400 text-sm">24hr response time</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <div className="text-white">Perth, WA</div>
                  <div className="text-gray-400 text-sm">Metro & Regional</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Standing Strong Support Services. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Accessibility</a>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-xs">
              NDIS Registered Provider • ABN: 12 345 678 901 • 
              <span className="text-blue-400 ml-1">Standing Strong With You</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
