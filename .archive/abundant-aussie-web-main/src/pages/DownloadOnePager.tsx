import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const DownloadOnePager = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Download One-Pager</h1>
            <p className="text-xl text-muted-foreground">
              Get the executive summary of The $19 Trillion Solution in a concise, shareable format.
            </p>
          </div>

          <div className="bg-muted/30 border-2 border-dashed border-muted rounded-lg p-12 text-center mb-8">
            <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">The $19 Trillion Solution</h3>
            <p className="text-muted-foreground mb-6">Executive Summary & Implementation Overview</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share Link
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">What's Included</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Executive summary of the $19 trillion wealth unlock strategy</li>
                <li>• Key financial metrics and per-capita distribution breakdown</li>
                <li>• Implementation timeline and milestone overview</li>
                <li>• Economic impact projections and risk mitigation strategies</li>
                <li>• Legislative pathway and stakeholder engagement plan</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Perfect For</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Decision Makers</h4>
                  <p className="text-sm text-muted-foreground">Politicians, policy advisors, and government officials</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Media & Journalists</h4>
                  <p className="text-sm text-muted-foreground">Press kits and background information</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Investors & Economists</h4>
                  <p className="text-sm text-muted-foreground">Financial analysis and market impact assessment</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Community Leaders</h4>
                  <p className="text-sm text-muted-foreground">Advocacy and grassroots organizing</p>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Distribution Guidelines</h3>
              <p className="text-muted-foreground">
                This document is designed for wide distribution. Please share it with stakeholders, 
                media contacts, and anyone interested in transformative economic policy. 
                Attribution to The $19 Trillion Solution initiative is appreciated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadOnePager;