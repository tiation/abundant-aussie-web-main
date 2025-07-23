
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Shield, Users, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Hero Content */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4 mr-2" />
            Standing Strong With You
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Comprehensive Support
            <span className="block text-gradient">Coordination & Recovery</span>
            <span className="block text-gray-900">Coaching in Perth</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Empowering individuals through personalized support coordination and psychosocial recovery coaching. 
            Founded by Caleb Standing, with lived experience and a commitment to community impact.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="gradient-bg text-white hover:opacity-90 transition-opacity px-8 py-3">
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-3">
              Learn More
            </Button>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-white border-blue-100 hover:shadow-lg transition-all-smooth">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
            <p className="text-gray-600">Individuals Supported</p>
          </Card>
          
          <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-white border-blue-100 hover:shadow-lg transition-all-smooth">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">15%</h3>
            <p className="text-gray-600">Income Donated to Charity</p>
          </Card>
          
          <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-white border-blue-100 hover:shadow-lg transition-all-smooth">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">5+</h3>
            <p className="text-gray-600">Years of Experience</p>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm text-gray-500 mb-4">Trusted by individuals, families, and organizations across Perth</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="bg-gray-100 px-6 py-3 rounded-lg">
              <span className="text-gray-600 font-medium">NDIS Registered</span>
            </div>
            <div className="bg-gray-100 px-6 py-3 rounded-lg">
              <span className="text-gray-600 font-medium">Accredited Provider</span>
            </div>
            <div className="bg-gray-100 px-6 py-3 rounded-lg">
              <span className="text-gray-600 font-medium">Community Focused</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
