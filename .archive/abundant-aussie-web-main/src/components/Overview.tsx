
import React from 'react';
import { Card } from '@/components/ui/card';

const Overview = () => {
  return (
    <div id="overview" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">The Vision</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A complete economic transformation in under five minutes that eliminates scarcity, 
            abolishes poverty, and creates unprecedented prosperity for all Australians.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-t-blue-600">
            <h3 className="text-xl font-bold mb-4 text-blue-800">Problem</h3>
            <p className="text-gray-600">
              Crime, poverty, and system burnout persist for one reason—unnatural scarcity in a nation of abundance.
            </p>
          </Card>
          
          <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-t-yellow-500">
            <h3 className="text-xl font-bold mb-4 text-blue-800">Revelation</h3>
            <p className="text-gray-600">
              Australia sits on $19 trillion in net wealth, yet we operate as if we're broke. This wealth can be unlocked.
            </p>
          </Card>
          
          <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-t-green-600">
            <h3 className="text-xl font-bold mb-4 text-blue-800">Solution</h3>
            <p className="text-gray-600">
              Convert wealth-on-paper into real spending power for every Australian, eliminating scarcity overnight.
            </p>
          </Card>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-2xl font-bold text-blue-900 max-w-3xl mx-auto">
            "A child born tomorrow will never know poverty, homelessness, or fear random violence."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
