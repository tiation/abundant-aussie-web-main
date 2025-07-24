
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const Mechanism = () => {
  return (
    <div className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A straightforward three-step process to unlock Australia's $19 trillion wealth
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-blue-300" />
            
            <div className="relative mb-16">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold relative z-10">1</div>
                </div>
                <div className="ml-8 bg-white rounded-lg shadow-lg p-8 flex-grow">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">Sovereign Wealth Conversion Fund (SWCF)</h3>
                  <p className="text-gray-600">
                    Parliament transfers a basket of federal-state assets (land leases, resource royalties, infrastructure equity) into a publicly listed but non-tradable fund.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative mb-16">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold relative z-10">2</div>
                </div>
                <div className="ml-8 bg-white rounded-lg shadow-lg p-8 flex-grow">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">Digital Civic Shares (DCS)</h3>
                  <p className="text-gray-600">
                    Every citizen receives "Class-C" units yielding a fixed weekly distribution for five years plus one-time housing and investment credits. Units are non-transferable to prevent speculation.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold relative z-10">3</div>
                </div>
                <div className="ml-8 bg-white rounded-lg shadow-lg p-8 flex-grow">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">Liquidity Pipeline</h3>
                  <p className="text-gray-600">
                    DCS payouts flow through the existing New Payments Platform; housing credits redeemable via mortgage off-set or rent-to-buy vouchers.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-20 text-center">
            <Card className="bg-blue-900 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">The Numbers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-3xl font-bold text-yellow-400">$104K</p>
                    <p className="text-sm">Per Person Asset Value</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-yellow-400">$800</p>
                    <p className="text-sm">Weekly UBI</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-yellow-400">5 Years</p>
                    <p className="text-sm">Pre-Paid Government</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mechanism;
