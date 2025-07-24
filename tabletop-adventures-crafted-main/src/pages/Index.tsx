
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import CharacterCard from '@/components/Dashboard/CharacterCard';
import NewCharacterButton from '@/components/Dashboard/NewCharacterButton';
import RoleplaySessions from '@/components/Dashboard/RoleplaySessions';
import RecentCampaigns from '@/components/Dashboard/RecentCampaigns';
import EngagementFeatures from '@/components/Dashboard/EngagementFeatures';
import { dummyCharacters } from '@/data/dummyData';
import { RoleplayMessage } from '@/types/roleplay';

const dummyRoleplayMessages: RoleplayMessage[] = [
  {
    id: '1',
    character: 'Thorin Ironheart',
    message: 'The shadows grow longer in these caves. Keep your weapons close, friends.',
    timestamp: '2 mins ago',
    type: 'dnd'
  },
  {
    id: '2',
    character: 'Lyra Moonwhisper',
    message: 'I sense dark magic ahead. We should proceed with caution.',
    timestamp: '1 min ago',
    type: 'dnd'
  },
  {
    id: '3',
    character: 'Sophie',
    message: "I couldn't help but notice you always order the same drink every morning.",
    timestamp: '2 mins ago',
    type: 'relationship',
    emotion: 'curious'
  },
  {
    id: '4',
    character: 'James',
    message: "You've been paying attention? I thought I was the only one watching...",
    timestamp: '1 min ago',
    type: 'relationship',
    emotion: 'flirty'
  },
  {
    id: '5',
    character: 'Isabella',
    message: "The candlelight dances across your face so beautifully tonight...",
    timestamp: '2 mins ago',
    type: 'romantic',
    emotion: 'passionate',
    isAdult: true
  },
  {
    id: '6',
    character: 'Marcus',
    message: "Every moment with you feels like an eternity of bliss.",
    timestamp: '1 min ago',
    type: 'romantic',
    emotion: 'intimate',
    isAdult: true
  },
  {
    id: '7',
    character: 'Belle',
    message: "There's something sweet, and almost kind... But he was mean and he was coarse and unrefined.",
    timestamp: '2 mins ago',
    type: 'beauty-beast',
    emotion: 'conflicted'
  },
  {
    id: '8',
    character: 'Beast',
    message: "She glanced this way, I thought I saw... and when we touched she didn't shudder at my paw.",
    timestamp: '1 min ago',
    type: 'beauty-beast',
    emotion: 'hopeful'
  },
  {
    id: '9',
    character: 'Alex',
    message: "I've never felt so understood by anyone before. It's like you see parts of me I've never shared with anyone.",
    timestamp: '3 mins ago',
    type: 'intimacy',
    emotion: 'vulnerable',
    connectionStrength: 8
  },
  {
    id: '10',
    character: 'Jordan',
    message: "When we talk like this, the rest of the world fades away. I feel truly seen for the first time.",
    timestamp: '2 mins ago',
    type: 'intimacy',
    emotion: 'connected',
    connectionStrength: 9
  },
  {
    id: '11',
    character: 'Phoenix',
    message: "As I run my hands down your back, I whisper exactly what I want to do to you tonight...",
    timestamp: '2 mins ago',
    type: 'fantasy',
    emotion: 'desire',
    isAdult: true,
    fantasyRating: 4
  },
  {
    id: '12',
    character: 'River',
    message: "In this world we've created together, we can explore every desire without judgment or limits.",
    timestamp: '1 min ago',
    type: 'fantasy',
    emotion: 'liberated',
    isAdult: true,
    fantasyRating: 5
  },
  {
    id: '13',
    character: 'Taylor',
    message: "I recognize now how my past trauma has been affecting my relationships. I'm ready to work through it.",
    timestamp: '3 mins ago',
    type: 'growth',
    emotion: 'determined',
    growthProgress: 45
  },
  {
    id: '14',
    character: 'Morgan',
    message: "That's incredibly insightful. When you understand your patterns, you can begin to change them. Let's explore some techniques.",
    timestamp: '2 mins ago',
    type: 'growth',
    emotion: 'supportive',
    growthProgress: 60
  }
];

const Index: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h1 className="text-3xl font-script text-rose-800">Your Characters</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search characters..." className="pl-9" />
          </div>
          <Button className="bg-primary">
            <Plus className="mr-2 h-4 w-4" />
            New
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dummyCharacters.map(character => (
          <CharacterCard key={character.id} character={character} />
        ))}
        <NewCharacterButton />
      </div>
      
      <div className="mt-12">
        <RoleplaySessions messages={dummyRoleplayMessages} />
      </div>
      
      <div className="mt-12">
        <EngagementFeatures />
      </div>
      
      <div className="mt-12">
        <RecentCampaigns />
      </div>
    </div>
  );
};

export default Index;
