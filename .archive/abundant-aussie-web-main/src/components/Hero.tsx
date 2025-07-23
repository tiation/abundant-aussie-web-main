
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const scrollToOverview = () => {
    document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-yellow-300 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-blue-400 blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tighter">
            The <span className="text-yellow-400">$19 Trillion</span> Solution
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
            Australia's balance sheet says we're a $19 trillion nation. If we unlock even a third of that value, we can wipe every public debt, pre-pay government for five years, and put an asset-plus-UBI in every adult and child's pocket—today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold px-8 py-6 text-lg rounded-lg">
              <Link to="/learn-more">Learn More</Link>
            </Button>
            <Button asChild variant="outline-light" className="px-8 py-6 text-lg rounded-lg">
              <Link to="/see-numbers">See The Numbers</Link>
            </Button>
          </div>
        </div>
      </div>
      <button 
        onClick={scrollToOverview} 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce"
        aria-label="Scroll down"
      >
        <ArrowDown className="w-10 h-10" />
      </button>
    </div>
  );
};

export default Hero;
