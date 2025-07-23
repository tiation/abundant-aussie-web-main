
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, User, Sparkles, MessageSquare, Layers,
  ArrowRight, Star, Award, Zap
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { type CharacterProfile } from '@/types/roleplay';

interface CrossoverEvent {
  id: string;
  title: string;
  description: string;
  scenario: string;
  primaryType: string;
  secondaryType: string;
  suggestedCharacters: string[];
  rewards: {
    xp: number;
    achievement?: string;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  popularity: number;
  image?: string;
}

const sampleCrossovers: CrossoverEvent[] = [
  {
    id: 'cross1',
    title: 'Magic Meets Technology',
    description: 'A fantasy character encounters a sci-fi world, bridging magic and technology in unexpected ways.',
    scenario: 'When a portal opens between worlds, characters must navigate their conflicting worldviews to solve a mystery threatening both realms.',
    primaryType: 'fantasy',
    secondaryType: 'scifi',
    suggestedCharacters: ['Wizard', 'Engineer', 'Knight', 'Scientist'],
    rewards: {
      xp: 750,
      achievement: 'Dimensional Diplomat'
    },
    difficulty: 'hard',
    popularity: 87,
    image: 'https://placehold.co/600x400/4B5563/FFFFFF?text=Magic+%26+Tech&font=playfair'
  },
  {
    id: 'cross2',
    title: 'Heroes & Heartthrobs',
    description: 'Adventure characters meet romantic scenarios as epic quests give way to matters of the heart.',
    scenario: 'After defeating the dragon, the heroes find themselves at a royal ball where political intrigue and romantic tensions test their different skills.',
    primaryType: 'dnd',
    secondaryType: 'romantic',
    suggestedCharacters: ['Bard', 'Noble', 'Rogue', 'Paladin'],
    rewards: {
      xp: 600,
      achievement: 'Romantic Hero'
    },
    difficulty: 'medium',
    popularity: 92,
    image: 'https://placehold.co/600x400/9F7AEA/FFFFFF?text=Heroes+%26+Hearts&font=playfair'
  },
  {
    id: 'cross3',
    title: 'Beasts of Growth',
    description: 'Beauty & Beast characters face personal development challenges that transform their relationships.',
    scenario: 'The beast must work through inner demons while the beauty confronts her own prejudices in a series of self-discovery challenges.',
    primaryType: 'beauty-beast',
    secondaryType: 'growth',
    suggestedCharacters: ['Beast', 'Beauty', 'Mentor', 'Challenger'],
    rewards: {
      xp: 550
    },
    difficulty: 'medium',
    popularity: 79,
    image: 'https://placehold.co/600x400/7F9CF5/FFFFFF?text=Beasts+of+Growth&font=playfair'
  }
];

interface CharacterCrossoverProps {
  characters: CharacterProfile[];
}

const CharacterCrossover: React.FC<CharacterCrossoverProps> = ({ characters }) => {
  const [selectedCrossover, setSelectedCrossover] = useState<string | null>(null);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const { toast } = useToast();

  const handleToggleCharacter = (characterId: string) => {
    if (selectedCharacters.includes(characterId)) {
      setSelectedCharacters(selectedCharacters.filter(id => id !== characterId));
    } else if (selectedCharacters.length < 2) {
      setSelectedCharacters([...selectedCharacters, characterId]);
    } else {
      toast({
        title: "Maximum Characters Selected",
        description: "You can only select up to 2 characters for a crossover.",
        variant: "destructive"
      });
    }
  };

  const handleStartCrossover = () => {
    if (selectedCharacters.length < 2) {
      toast({
        title: "Select More Characters",
        description: "Please select 2 characters to participate in the crossover.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Crossover Started!",
      description: "Your characters are ready to begin their crossover adventure.",
      action: (
        <Button size="sm" variant="outline">
          View Scenario
        </Button>
      )
    });
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'dnd': return <User className="h-4 w-4" />;
      case 'romantic': return <Star className="h-4 w-4" />;
      case 'growth': return <Zap className="h-4 w-4" />;
      case 'beauty-beast': return <Sparkles className="h-4 w-4" />;
      case 'scifi': return <Layers className="h-4 w-4" />;
      case 'fantasy': return <Sparkles className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'dnd': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'romantic': return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'growth': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'beauty-beast': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'scifi': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'fantasy': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'hard': return 'bg-rose-100 text-rose-800 border-rose-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif font-bold text-amber-900">Character Crossovers</h2>
          <p className="text-sm text-stone-600 mt-1">
            Combine characters from different genres for unique roleplay experiences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Crossover Events */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-serif font-medium text-amber-900">Select a Crossover Event</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleCrossovers.map((crossover) => (
              <Card 
                key={crossover.id} 
                className={`parchment fantasy-shadow cursor-pointer transition-all ${
                  selectedCrossover === crossover.id ? 'ring-2 ring-primary' : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedCrossover(crossover.id)}
              >
                {crossover.image && (
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={crossover.image} 
                      alt={crossover.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-serif text-amber-900">{crossover.title}</CardTitle>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className={getTypeColor(crossover.primaryType)}>
                      {getTypeIcon(crossover.primaryType)}
                      <span className="ml-1 capitalize">{crossover.primaryType}</span>
                    </Badge>
                    <ArrowRight className="h-4 w-4" />
                    <Badge variant="outline" className={getTypeColor(crossover.secondaryType)}>
                      {getTypeIcon(crossover.secondaryType)}
                      <span className="ml-1 capitalize">{crossover.secondaryType}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-sm text-stone-700 line-clamp-2">{crossover.description}</p>
                  
                  <div className="mt-2 flex justify-between items-center">
                    <Badge variant="outline" className={getDifficultyColor(crossover.difficulty)}>
                      {crossover.difficulty}
                    </Badge>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1 text-amber-700" />
                      <span className="text-xs">{crossover.popularity} players</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedCrossover && (
            <Card className="parchment fantasy-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-serif text-amber-900">
                  {sampleCrossovers.find(c => c.id === selectedCrossover)?.title}
                </CardTitle>
                <CardDescription>
                  Scenario Details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-stone-700">
                  {sampleCrossovers.find(c => c.id === selectedCrossover)?.scenario}
                </p>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Suggested Character Types:</h4>
                  <div className="flex flex-wrap gap-2">
                    {sampleCrossovers.find(c => c.id === selectedCrossover)?.suggestedCharacters.map((char, idx) => (
                      <Badge key={idx} variant="secondary">{char}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Rewards:</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-amber-500" />
                      <span>{sampleCrossovers.find(c => c.id === selectedCrossover)?.rewards.xp} XP</span>
                    </div>
                    {sampleCrossovers.find(c => c.id === selectedCrossover)?.rewards.achievement && (
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1 text-amber-500" />
                        <span>{sampleCrossovers.find(c => c.id === selectedCrossover)?.rewards.achievement}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Side - Character Selection */}
        <div>
          <h3 className="text-lg font-serif font-medium text-amber-900 mb-4">Select Your Characters</h3>
          
          <div className="space-y-3">
            {characters.map((character) => (
              <Card 
                key={character.id}
                className={`parchment cursor-pointer transition-all ${
                  selectedCharacters.includes(character.id) ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleToggleCharacter(character.id)}
              >
                <div className="p-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center overflow-hidden">
                    <User className="h-5 w-5 text-amber-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-amber-900">{character.name}</h4>
                    <div className="flex items-center text-xs text-stone-600">
                      <span>Level {character.level}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-6">
            <Button 
              disabled={selectedCharacters.length < 2 || !selectedCrossover}
              className="w-full"
              onClick={handleStartCrossover}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Crossover
            </Button>
            
            <p className="text-center text-xs text-stone-500 mt-2">
              {selectedCharacters.length}/2 characters selected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCrossover;
