import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Users, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearnMore = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Learn More About The Solution</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Comprehensive information about Australia's $19 Trillion transformation strategy.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="border rounded-lg p-6">
              <FileText className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Detailed Analysis</h3>
              <p className="text-muted-foreground mb-4">
                Deep dive into the economic mechanisms, asset valuations, and implementation timeline.
              </p>
              <Button variant="outline">View Full Report</Button>
            </div>

            <div className="border rounded-lg p-6">
              <Users className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Case Studies</h3>
              <p className="text-muted-foreground mb-4">
                International examples of successful wealth redistribution and UBI implementations.
              </p>
              <Button variant="outline">Explore Cases</Button>
            </div>

            <div className="border rounded-lg p-6">
              <Calculator className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Economic Impact Calculator</h3>
              <p className="text-muted-foreground mb-4">
                Model the economic effects on different demographics and regions across Australia.
              </p>
              <Button variant="outline">Use Calculator</Button>
            </div>

            <div className="border rounded-lg p-6">
              <FileText className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Implementation Roadmap</h3>
              <p className="text-muted-foreground mb-4">
                Step-by-step guide to legislative requirements and execution phases.
              </p>
              <Button variant="outline">View Roadmap</Button>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Key Principles</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Asset-backed wealth conversion without forced liquidation</li>
              <li>• Digital civic shares with built-in inflation protection</li>
              <li>• Mandatory community connection programs</li>
              <li>• Five-year government pre-funding for stability</li>
              <li>• Gradual implementation with pilot programs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;