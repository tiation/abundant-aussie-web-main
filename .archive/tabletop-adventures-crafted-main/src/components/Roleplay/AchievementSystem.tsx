
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Trophy, Star, Calendar, Zap, Book, Users, Compass } from 'lucide-react';
import { Achievement } from '@/types/roleplay';

interface AchievementSystemProps {
  achievements: Achievement[];
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({ achievements }) => {
  const [filter, setFilter] = useState<string>('all');
  
  const filteredAchievements = achievements.filter(achievement => 
    filter === 'all' || filter === achievement.category || 
    (filter === 'unlocked' && achievement.unlocked) ||
    (filter === 'locked' && !achievement.unlocked)
  );
  
  const getAchievementIcon = (category: string) => {
    switch(category) {
      case 'writer': return <Book className="h-4 w-4" />;
      case 'explorer': return <Compass className="h-4 w-4" />;
      case 'creator': return <Zap className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      case 'master': return <Trophy className="h-4 w-4 text-amber-600" />;
      default: return <Star className="h-4 w-4" />;
    }
  };
  
  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'uncommon': return 'bg-green-100 text-green-700 border-green-200';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'legendary': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };
  
  const getProgressColor = (rarity: string) => {
    switch(rarity) {
      case 'common': return { bg: 'bg-slate-100', indicator: 'bg-slate-400' };
      case 'uncommon': return { bg: 'bg-green-100', indicator: 'bg-green-500' };
      case 'rare': return { bg: 'bg-blue-100', indicator: 'bg-blue-500' };
      case 'epic': return { bg: 'bg-purple-100', indicator: 'bg-purple-600' };
      case 'legendary': return { bg: 'bg-amber-100', indicator: 'bg-amber-500' };
      default: return { bg: 'bg-slate-100', indicator: 'bg-slate-400' };
    }
  };
  
  return (
    <Card className="achievement-card bg-gradient-to-br from-slate-50 to-slate-100 fantasy-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Achievements
          </h3>
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
            {achievements.filter(a => a.unlocked).length}/{achievements.length} Unlocked
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-2 pt-0">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-7 mb-4">
            <TabsTrigger value="all" onClick={() => setFilter('all')}>All</TabsTrigger>
            <TabsTrigger value="unlocked" onClick={() => setFilter('unlocked')}>Unlocked</TabsTrigger>
            <TabsTrigger value="locked" onClick={() => setFilter('locked')}>Locked</TabsTrigger>
            <TabsTrigger value="writer" onClick={() => setFilter('writer')}>Writer</TabsTrigger>
            <TabsTrigger value="explorer" onClick={() => setFilter('explorer')}>Explorer</TabsTrigger>
            <TabsTrigger value="creator" onClick={() => setFilter('creator')}>Creator</TabsTrigger>
            <TabsTrigger value="social" onClick={() => setFilter('social')}>Social</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-2">
            {filteredAchievements.map((achievement) => {
              const colors = getProgressColor(achievement.rarity);
              return (
                <HoverCard key={achievement.id}>
                  <HoverCardTrigger asChild>
                    <div className={`achievement-item p-2 rounded-md border flex items-center gap-3 cursor-help
                      ${achievement.unlocked 
                        ? 'bg-white border-slate-200' 
                        : 'bg-slate-50/70 border-slate-100 opacity-75'}`}
                    >
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center
                        ${getRarityColor(achievement.rarity)}`}
                      >
                        {getAchievementIcon(achievement.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-slate-900 truncate">{achievement.title}</h4>
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        {achievement.progress !== undefined && achievement.maxProgress && (
                          <div className="mt-1.5">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-xs text-slate-600">Progress</span>
                              <span className="text-xs text-slate-700">{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100} 
                              className={`h-1.5 ${colors.bg}`}
                              indicatorClassName={colors.indicator}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-72">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-slate-900">{achievement.title}</h4>
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700">{achievement.description}</p>
                      {achievement.unlocked && achievement.dateUnlocked && (
                        <div className="flex items-center text-xs text-slate-500 pt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          Unlocked on {achievement.dateUnlocked}
                        </div>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            })}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AchievementSystem;
