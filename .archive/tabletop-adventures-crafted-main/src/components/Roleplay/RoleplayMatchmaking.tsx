import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Users, UserRound, Search, Heart, MessagesSquare, 
  Clock, Filter, Zap, Sparkles
} from 'lucide-react';
import { CharacterProfile } from '@/types/roleplay';
import { toast } from "@/hooks/use-toast";

interface RoleplayPartner {
  id: string;
  profile: CharacterProfile;
  matchScore: number;
  activeTime: string;
  preferredScenarios: string[];
  roleplayStyle: string[];
  availability: 'now' | 'soon' | 'scheduled';
}

interface RoleplayMatchmakingProps {
  userProfile: CharacterProfile;
  suggestedPartners: RoleplayPartner[];
}

const RoleplayMatchmaking: React.FC<RoleplayMatchmakingProps> = ({ userProfile, suggestedPartners }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [partners, setPartners] = useState(suggestedPartners);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
    
    if (activeFilter === filter) {
      setPartners(suggestedPartners);
    } else {
      switch(filter) {
        case 'online':
          setPartners(suggestedPartners.filter(p => p.availability === 'now'));
          break;
        case 'highMatch':
          setPartners(suggestedPartners.filter(p => p.matchScore >= 85));
          break;
        case 'fantasy':
          setPartners(suggestedPartners.filter(p => 
            p.preferredScenarios.some(s => s.toLowerCase().includes('fantasy'))
          ));
          break;
        case 'growth':
          setPartners(suggestedPartners.filter(p => 
            p.preferredScenarios.some(s => s.toLowerCase().includes('growth'))
          ));
          break;
        default:
          setPartners(suggestedPartners);
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setPartners(suggestedPartners);
    } else {
      const filtered = suggestedPartners.filter(partner => 
        partner.profile.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        partner.preferredScenarios.some(s => s.toLowerCase().includes(e.target.value.toLowerCase())) ||
        partner.roleplayStyle.some(s => s.toLowerCase().includes(e.target.value.toLowerCase()))
      );
      setPartners(filtered);
    }
  };

  const handleInvite = (partnerId: string) => {
    toast({
      title: "Invitation sent!",
      description: "We'll notify you when they respond.",
    });
  };

  return (
    <Card className="matchmaking-card bg-gradient-to-br from-rose-50 to-purple-50 fantasy-shadow">
      <CardHeader className="py-3 px-6 bg-gradient-to-r from-rose-200/40 to-purple-200/40 border-b border-rose-300/20">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-rose-900 text-xl flex items-center gap-2">
            <Users className="w-5 h-5" />
            Find Roleplay Partners
          </h3>
          <Badge variant="outline" className="bg-rose-100 text-rose-700 border-rose-300">
            {partners.filter(p => p.availability === 'now').length} Online
          </Badge>
        </div>
        <div className="mt-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            type="text"
            placeholder="Search by name, scenario or style..."
            className="pl-9 bg-white/70 border-rose-200/50"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </CardHeader>
      <div className="px-4 py-2 flex flex-wrap gap-2 border-b border-rose-100">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`text-xs ${activeFilter === 'online' ? 'bg-rose-100 text-rose-800' : 'text-rose-700'}`}
          onClick={() => handleFilterClick('online')}
        >
          <Clock className="w-3 h-3 mr-1" />
          Online Now
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`text-xs ${activeFilter === 'highMatch' ? 'bg-rose-100 text-rose-800' : 'text-rose-700'}`}
          onClick={() => handleFilterClick('highMatch')}
        >
          <Heart className="w-3 h-3 mr-1" />
          High Match
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`text-xs ${activeFilter === 'fantasy' ? 'bg-rose-100 text-rose-800' : 'text-rose-700'}`}
          onClick={() => handleFilterClick('fantasy')}
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Fantasy
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`text-xs ${activeFilter === 'growth' ? 'bg-rose-100 text-rose-800' : 'text-rose-700'}`}
          onClick={() => handleFilterClick('growth')}
        >
          <Zap className="w-3 h-3 mr-1" />
          Growth
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="space-y-4">
          {partners.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Search className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p>No roleplay partners found with your current filters.</p>
              <p className="text-sm">Try different search terms or filters</p>
            </div>
          ) : (
            partners.map((partner) => (
              <div 
                key={partner.id} 
                className="flex flex-col md:flex-row gap-4 p-3 rounded-lg border border-rose-200/50 bg-white/60"
              >
                <div className="flex items-center gap-3 md:w-1/3">
                  <div className="h-14 w-14 rounded-full bg-rose-100 border-2 border-rose-200 flex items-center justify-center overflow-hidden relative">
                    <UserRound className="h-7 w-7 text-rose-700" />
                    {partner.availability === 'now' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-rose-900">{partner.profile.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-rose-50 text-rose-700 text-xs border-rose-200">
                        Level {partner.profile.level}
                      </Badge>
                      <span className="text-xs text-slate-500">{partner.activeTime}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Heart className="w-3 h-3 text-rose-500" />
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full">
                        <div 
                          className="h-full bg-gradient-to-r from-rose-400 to-purple-500 rounded-full"
                          style={{ width: `${partner.matchScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-rose-700">{partner.matchScore}% match</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="text-xs text-slate-500 block mb-1">Roleplay Style</span>
                    <div className="flex flex-wrap gap-1">
                      {partner.roleplayStyle.map((style, i) => (
                        <Badge key={i} variant="outline" className="bg-slate-50 text-slate-700 text-xs">
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Preferred Scenarios</span>
                    <div className="flex flex-wrap gap-1">
                      {partner.preferredScenarios.map((scenario, i) => (
                        <Badge key={i} variant="outline" className="bg-purple-50 text-purple-700 text-xs">
                          {scenario}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex md:flex-col justify-center items-center gap-2 md:w-24">
                  <Button 
                    size="sm"
                    className="w-full bg-gradient-to-r from-rose-500 to-purple-500 text-white hover:from-rose-600 hover:to-purple-600"
                    onClick={() => handleInvite(partner.id)}
                  >
                    Invite
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="w-full border-rose-200 text-rose-700 hover:bg-rose-50"
                  >
                    <MessagesSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleplayMatchmaking;
