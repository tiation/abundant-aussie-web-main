
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const RecentCampaigns: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-amber-900">Recent Campaigns</h2>
        <Button variant="ghost" className="text-amber-800">View all</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="parchment p-6 rounded-lg fantasy-shadow">
          <h3 className="text-xl font-serif font-bold text-amber-900 mb-2">The Lost Mines of Phandelver</h3>
          <p className="text-stone-600 text-sm mb-4">Ongoing campaign • Last played 2 days ago</p>
          <div className="flex -space-x-3">
            <div className="w-8 h-8 rounded-full border-2 border-card bg-amber-100 flex items-center justify-center text-xs font-medium">TH</div>
            <div className="w-8 h-8 rounded-full border-2 border-card bg-amber-100 flex items-center justify-center text-xs font-medium">LN</div>
            <div className="w-8 h-8 rounded-full border-2 border-card bg-amber-100 flex items-center justify-center text-xs font-medium">+2</div>
          </div>
        </div>
        
        <div className="parchment p-6 rounded-lg fantasy-shadow">
          <h3 className="text-xl font-serif font-bold text-amber-900 mb-2">Curse of Strahd</h3>
          <p className="text-stone-600 text-sm mb-4">Upcoming • Starts in 3 days</p>
          <div className="flex -space-x-3">
            <div className="w-8 h-8 rounded-full border-2 border-card bg-amber-100 flex items-center justify-center text-xs font-medium">AF</div>
            <div className="w-8 h-8 rounded-full border-2 border-card bg-amber-100 flex items-center justify-center text-xs font-medium">+4</div>
          </div>
        </div>
        
        <div className="parchment p-6 rounded-lg fantasy-shadow border-dashed border-2 border-amber-800/30 flex flex-col items-center justify-center">
          <Button variant="ghost" className="text-amber-800">
            <Plus className="mr-2 h-4 w-4" />
            Start New Campaign
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecentCampaigns;
