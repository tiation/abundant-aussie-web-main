
import React from 'react';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold">The $19 Trillion Solution</h2>
            <p className="text-blue-300 mt-1">Transforming Australia's Economy</p>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-blue-300 hover:text-yellow-400 transition-colors">About</a>
            <a href="#" className="text-blue-300 hover:text-yellow-400 transition-colors">The Plan</a>
            <a href="#" className="text-blue-300 hover:text-yellow-400 transition-colors">Research</a>
            <a href="#" className="text-blue-300 hover:text-yellow-400 transition-colors">Contact</a>
          </div>
        </div>
        
        <Separator className="bg-blue-800 my-6" />
        
        <div className="text-center text-blue-400 text-sm">
          <p>&copy; {new Date().getFullYear()} The $19 Trillion Solution. All rights reserved.</p>
          <p className="mt-2">
            This is a conceptual economic proposal. All figures are for illustration purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
