
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, User, Users, Clock, Flame, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Challenge {
  id: string;
  title: string;
  description: string;
  deadline: string;
  category: 'writing' | 'character' | 'worldbuilding' | 'community';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  participants: number;
  xpReward: number;
  badgeReward?: string;
  progress?: number;
  isActive: boolean;
  isPopular?: boolean;
}

const sampleChallenges: Challenge[] = [
  {
    id: 'c1',
    title: "Unexpected Alliances",
    description: "Create a roleplay scene where bitter enemies must work together to overcome a common threat.",
    deadline: "2025-05-10",
    category: "writing",
    difficulty: "intermediate",
    participants: 127,
    xpReward: 500,
    badgeReward: "Alliance Forger",
    isActive: true,
    isPopular: true,
    progress: 65
  },
  {
    id: 'c2',
    title: "Character Growth Journey",
    description: "Develop a character who undergoes significant personal growth over the course of a story.",
    deadline: "2025-05-15",
    category: "character",
    difficulty: "intermediate",
    participants: 98,
    xpReward: 450,
    isActive: true,
    progress: 30
  },
  {
    id: 'c3',
    title: "Magical System Designer",
    description: "Create an original magical system with consistent rules and unique elements for a fantasy roleplay.",
    deadline: "2025-05-20",
    category: "worldbuilding",
    difficulty: "advanced",
    participants: 76,
    xpReward: 650,
    badgeReward: "Arcane Architect",
    isActive: true,
    isPopular: true
  },
  {
    id: 'c4',
    title: "Community Story Chain",
    description: "Participate in a collaborative story where each writer adds a paragraph continuing from the previous contribution.",
    deadline: "2025-05-12",
    category: "community",
    difficulty: "beginner",
    participants: 215,
    xpReward: 350,
    isActive: true,
    isPopular: true,
    progress: 10
  },
  {
    id: 'c5',
    title: "Fantasy Race Creation",
    description: "Design a unique fantasy race complete with culture, history, and physical characteristics.",
    deadline: "2025-05-25",
    category: "worldbuilding",
    difficulty: "intermediate",
    participants: 64,
    xpReward: 500,
    isActive: true
  },
  {
    id: 'c6',
    title: "Dialogue Master",
    description: "Write a compelling scene driven primarily by dialogue between two distinct characters.",
    deadline: "2025-05-18",
    category: "writing",
    difficulty: "intermediate",
    participants: 89,
    xpReward: 400,
    isActive: true
  }
];

const CommunityChallenges: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'popular' | 'complete'>('all');
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>(['c1', 'c4']);

  const handleJoinChallenge = (challengeId: string) => {
    if (joinedChallenges.includes(challengeId)) {
      setJoinedChallenges(joinedChallenges.filter(id => id !== challengeId));
    } else {
      setJoinedChallenges([...joinedChallenges, challengeId]);
    }
  };

  const filteredChallenges = sampleChallenges.filter(challenge => {
    if (filter === 'all') return true;
    if (filter === 'active') return challenge.isActive;
    if (filter === 'popular') return challenge.isPopular;
    if (filter === 'complete') return joinedChallenges.includes(challenge.id) && challenge.progress === 100;
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'writing':
        return <Award className="h-4 w-4" />;
      case 'character':
        return <User className="h-4 w-4" />;
      case 'worldbuilding':
        return <TrendingUp className="h-4 w-4" />;
      case 'community':
        return <Users className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'writing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'character':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'worldbuilding':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'community':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'intermediate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'advanced':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDeadline = (dateString: string) => {
    const deadline = new Date(dateString);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 0 ? 'Ended' : `${diffDays} days left`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold text-amber-900">Community Challenges</h2>
        <Button variant="outline" className="text-amber-800">
          <Award className="mr-2 h-4 w-4" />
          View All Badges
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="complete">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={filter}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge.id} className="parchment fantasy-shadow h-full flex flex-col">
                <CardHeader className="pb-2">
                  {challenge.isPopular && (
                    <Badge className="absolute -top-2 -right-2 bg-amber-500">
                      <Flame className="mr-1 h-3 w-3" /> Popular
                    </Badge>
                  )}
                  <CardTitle className="text-lg font-serif text-amber-900">{challenge.title}</CardTitle>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className={getCategoryColor(challenge.category)}>
                      {getCategoryIcon(challenge.category)}
                      <span className="ml-1 capitalize">{challenge.category}</span>
                    </Badge>
                    <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                      <span className="capitalize">{challenge.difficulty}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="py-2 flex-1">
                  <p className="text-sm text-stone-700">{challenge.description}</p>
                  
                  {joinedChallenges.includes(challenge.id) && challenge.progress !== undefined && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="mt-4 flex items-center justify-between text-xs text-stone-600">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{challenge.participants} participants</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatDeadline(challenge.deadline)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-amber-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between w-full text-sm">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-amber-600" />
                      <span className="font-medium">{challenge.xpReward} XP</span>
                    </div>
                    {challenge.badgeReward && (
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1 text-amber-600" />
                        <span className="font-medium">{challenge.badgeReward}</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    className={joinedChallenges.includes(challenge.id) ? 'bg-amber-200 text-amber-800 hover:bg-amber-300' : ''}
                    variant={joinedChallenges.includes(challenge.id) ? 'outline' : 'default'}
                    onClick={() => handleJoinChallenge(challenge.id)}
                  >
                    {joinedChallenges.includes(challenge.id) ? 'Leave Challenge' : 'Join Challenge'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityChallenges;
