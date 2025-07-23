
import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, Award, Star, Heart, Book, Zap } from 'lucide-react';
import { type CharacterProfile as CharacterProfileType } from '@/types/roleplay';

interface CharacterProfileProps {
  profile: CharacterProfileType;
}

const CharacterProfile: React.FC<CharacterProfileProps> = ({ profile }) => {
  // Calculate next level XP requirements
  const nextLevelXp = profile.level * 100;
  const currentXpProgress = (profile.experience / nextLevelXp) * 100;
  
  return (
    <Card className="character-profile-card bg-gradient-to-br from-amber-50 to-orange-50 fantasy-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center overflow-hidden">
            <User className="h-8 w-8 text-amber-700" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-amber-900">{profile.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                Level {profile.level}
              </Badge>
              <div className="text-xs text-amber-700 flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span>{profile.stats.popularity} popularity</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-amber-800">Experience</span>
            <span className="text-xs text-amber-700">{profile.experience}/{nextLevelXp} XP</span>
          </div>
          <Progress value={currentXpProgress} className="h-2 bg-amber-100" />
        </div>
        
        <div>
          <h4 className="font-serif font-semibold text-amber-900 mb-2">Personality</h4>
          <div className="flex flex-wrap gap-1">
            {profile.personality.map((trait, index) => (
              <Badge key={index} variant="secondary" className="bg-amber-100/70 text-amber-800">
                {trait}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none text-amber-800">
          <h4 className="font-serif font-semibold text-amber-900 mb-1">Backstory</h4>
          <p className="text-sm">{profile.backstory}</p>
        </div>
        
        <div>
          <h4 className="font-serif font-semibold text-amber-900 mb-2">Stats</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="stat-item">
              <span className="text-xs text-amber-700 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Creativity
              </span>
              <Progress value={profile.stats.creativity * 10} className="h-1.5 bg-amber-100" />
            </div>
            <div className="stat-item">
              <span className="text-xs text-amber-700 flex items-center gap-1">
                <Book className="h-3 w-3" />
                Depth
              </span>
              <Progress value={profile.stats.depth * 10} className="h-1.5 bg-amber-100" />
            </div>
            <div className="stat-item">
              <span className="text-xs text-amber-700 flex items-center gap-1">
                <Heart className="h-3 w-3" />
                Interaction
              </span>
              <Progress value={profile.stats.interaction * 10} className="h-1.5 bg-amber-100" />
            </div>
            <div className="stat-item">
              <span className="text-xs text-amber-700 flex items-center gap-1">
                <Star className="h-3 w-3" />
                Consistency
              </span>
              <Progress value={profile.stats.consistency * 10} className="h-1.5 bg-amber-100" />
            </div>
          </div>
        </div>
        
        {profile.badges.length > 0 && (
          <div>
            <h4 className="font-serif font-semibold text-amber-900 mb-2">Badges</h4>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((badge, index) => (
                <div key={index} className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-100 border border-amber-300 flex items-center justify-center" title={badge}>
                  <Award className="h-4 w-4 text-amber-700" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CharacterProfile;
