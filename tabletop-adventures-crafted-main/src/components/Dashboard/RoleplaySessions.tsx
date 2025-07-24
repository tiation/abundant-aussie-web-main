import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Heart, Plus, Flower, HeartHandshake, Flame, Rocket } from 'lucide-react';
import RoleplayCard from '@/components/Roleplay/RoleplayCard';
import RelationshipRoleplayCard from '@/components/Roleplay/RelationshipRoleplayCard';
import RomanticRoleplayCard from '@/components/Roleplay/RomanticRoleplayCard';
import BeautyBeastRoleplayCard from '@/components/Roleplay/BeautyBeastRoleplayCard';
import IntimacyRoleplayCard from '@/components/Roleplay/IntimacyRoleplayCard';
import FantasyRoleplayCard from '@/components/Roleplay/FantasyRoleplayCard';
import GrowthRoleplayCard from '@/components/Roleplay/GrowthRoleplayCard';
import { RoleplayMessage } from '@/types/roleplay';

interface RoleplaySessionsProps {
  messages: RoleplayMessage[];
}

const RoleplaySessions: React.FC<RoleplaySessionsProps> = ({ messages }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-amber-900">Active Roleplay Sessions</h2>
        <div className="flex gap-2 flex-wrap justify-end">
          <Button variant="ghost" className="text-amber-800">
            <MessageSquare className="w-4 h-4 mr-2" />
            New D&D Session
          </Button>
          <Button variant="ghost" className="text-rose-700">
            <Heart className="w-4 h-4 mr-2" />
            New Romance Session
          </Button>
          <Button variant="ghost" className="text-rose-800">
            <Heart className="w-4 h-4 mr-2" />
            New Adult Session
          </Button>
          <Button variant="ghost" className="text-purple-800">
            <Flower className="w-4 h-4 mr-2" />
            New Enchanted Tale
          </Button>
          <Button variant="ghost" className="text-rose-700 bg-gradient-to-r from-rose-50/50 to-purple-50/50">
            <HeartHandshake className="w-4 h-4 mr-2" />
            New Deep Connection
          </Button>
          <Button variant="ghost" className="text-purple-800 bg-gradient-to-r from-purple-50/50 to-indigo-50/50">
            <Flame className="w-4 h-4 mr-2" />
            New Fantasy
          </Button>
          <Button variant="ghost" className="text-emerald-700 bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
            <Rocket className="w-4 h-4 mr-2" />
            Personal Growth
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RoleplayCard 
          title="The Dark Cave Expedition"
          messages={messages.filter(m => m.type === 'dnd')}
        />
        
        <RelationshipRoleplayCard
          title="Coffee Shop Meet-Cute"
          messages={messages.filter(m => m.type === 'relationship')}
        />

        <RomanticRoleplayCard
          title="Moonlit Rendezvous"
          messages={messages.filter(m => m.type === 'romantic')}
        />
        
        <BeautyBeastRoleplayCard
          title="Tale As Old As Time"
          messages={messages.filter(m => m.type === 'beauty-beast')}
        />
        
        <IntimacyRoleplayCard
          title="Soul Connection"
          messages={messages.filter(m => m.type === 'intimacy')}
        />
        
        <FantasyRoleplayCard
          title="Secret Desires"
          messages={messages.filter(m => m.type === 'fantasy')}
        />
        
        <GrowthRoleplayCard
          title="Journey to Better Self"
          messages={messages.filter(m => m.type === 'growth')}
        />
        
        <div className="parchment p-6 rounded-lg fantasy-shadow border-dashed border-2 border-amber-800/30 flex flex-col items-center justify-center">
          <Button variant="ghost" className="text-amber-800">
            <Plus className="mr-2 h-4 w-4" />
            Start New D&D Session
          </Button>
        </div>

        <div className="bg-rose-50/50 p-6 rounded-lg fantasy-shadow border-dashed border-2 border-rose-300/30 flex flex-col items-center justify-center">
          <Button variant="ghost" className="text-rose-700">
            <Plus className="mr-2 h-4 w-4" />
            Start New Romance Session
          </Button>
        </div>

        <div className="bg-rose-100/50 p-6 rounded-lg fantasy-shadow border-dashed border-2 border-rose-400/30 flex flex-col items-center justify-center">
          <Button variant="ghost" className="text-rose-800">
            <Plus className="mr-2 h-4 w-4" />
            Start New Adult Session
          </Button>
        </div>
        
        <div className="bg-purple-50/50 p-6 rounded-lg fantasy-shadow border-dashed border-2 border-purple-300/30 flex flex-col items-center justify-center">
          <Button variant="ghost" className="text-purple-800">
            <Flower className="mr-2 h-4 w-4" />
            Start New Enchanted Tale
          </Button>
        </div>
        
        <div className="bg-gradient-to-br from-rose-50/50 to-purple-50/50 p-6 rounded-lg fantasy-shadow border-dashed border-2 border-rose-300/30 flex flex-col items-center justify-center">
          <Button variant="ghost" className="text-rose-700">
            <HeartHandshake className="mr-2 h-4 w-4" />
            Start New Deep Connection
          </Button>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50/50 to-indigo-50/50 p-6 rounded-lg fantasy-shadow border-dashed border-2 border-purple-300/30 flex flex-col items-center justify-center">
          <Button variant="ghost" className="text-purple-800">
            <Plus className="mr-2 h-4 w-4" />
            Start New Fantasy
          </Button>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 p-6 rounded-lg fantasy-shadow border-dashed border-2 border-emerald-300/30 flex flex-col items-center justify-center">
          <Button variant="ghost" className="text-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            Start Personal Growth
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleplaySessions;
