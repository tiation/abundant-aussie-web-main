import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, DollarSign, Users, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const SeeNumbers = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">The Numbers Behind The Solution</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Comprehensive financial breakdown of Australia's $19 trillion transformation.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-primary/10 rounded-lg p-6 text-center">
              <DollarSign className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold">$19T</div>
              <div className="text-sm text-muted-foreground">Total National Wealth</div>
            </div>

            <div className="bg-primary/10 rounded-lg p-6 text-center">
              <PieChart className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold">33%</div>
              <div className="text-sm text-muted-foreground">Required Unlock Rate</div>
            </div>

            <div className="bg-primary/10 rounded-lg p-6 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold">$104K</div>
              <div className="text-sm text-muted-foreground">Per Adult Package</div>
            </div>

            <div className="bg-primary/10 rounded-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold">$800</div>
              <div className="text-sm text-muted-foreground">Weekly UBI Payment</div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Asset Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Residential Property</span>
                  <span className="font-semibold">$11.2T (59%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Superannuation Assets</span>
                  <span className="font-semibold">$3.8T (20%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Business Assets</span>
                  <span className="font-semibold">$2.1T (11%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Government Assets</span>
                  <span className="font-semibold">$1.9T (10%)</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Distribution Plan</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Debt Elimination (Federal/State)</span>
                  <span className="font-semibold">$1.8T</span>
                </div>
                <div className="flex justify-between">
                  <span>Five-Year Government Pre-funding</span>
                  <span className="font-semibold">$2.5T</span>
                </div>
                <div className="flex justify-between">
                  <span>Adult Packages (18M people)</span>
                  <span className="font-semibold">$1.9T</span>
                </div>
                <div className="flex justify-between">
                  <span>Youth Investment Fund</span>
                  <span className="font-semibold">$0.1T</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Economic Impact Projections</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 85% reduction in poverty-related crime within 2 years</li>
                <li>• 40% increase in entrepreneurship and small business formation</li>
                <li>• 60% reduction in mental health service demand</li>
                <li>• 90% decrease in homelessness within 12 months</li>
                <li>• 35% increase in educational attainment rates</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button size="lg">Download Detailed Financial Model</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeNumbers;