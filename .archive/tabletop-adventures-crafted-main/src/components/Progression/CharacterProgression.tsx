
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronUp, Award, Bookmark, BookOpen, 
  Zap, BarChart3, TrendingUp, Brain, Heart,
  Shield, Swords, Sparkles
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CharacterSkill {
  id: string;
  name: string;
  level: number;
  experience: number;
  nextLevelExp: number;
  description: string;
  category: 'combat' | 'magic' | 'social' | 'knowledge' | 'crafting';
  abilities: string[];
}

interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

const sampleSkills: CharacterSkill[] = [
  {
    id: 'skill1',
    name: 'Swordsmanship',
    level: 3,
    experience: 150,
    nextLevelExp: 200,
    description: 'Proficiency with bladed weapons and dueling techniques.',
    category: 'combat',
    abilities: ['Quick Strike', 'Defensive Stance', 'Disarm']
  },
  {
    id: 'skill2',
    name: 'Elemental Magic',
    level: 2,
    experience: 80,
    nextLevelExp: 100,
    description: 'Control over the fundamental elemental forces.',
    category: 'magic',
    abilities: ['Flame Bolt', 'Water Shield']
  },
  {
    id: 'skill3',
    name: 'Persuasion',
    level: 4,
    experience: 240,
    nextLevelExp: 300,
    description: 'Ability to convince and persuade others through speech.',
    category: 'social',
    abilities: ['Charming Smile', 'Compelling Argument', 'Flattery', 'Intimidate']
  },
  {
    id: 'skill4',
    name: 'Lore Mastery',
    level: 3,
    experience: 170,
    nextLevelExp: 200,
    description: 'Knowledge of ancient stories, myths and historical events.',
    category: 'knowledge',
    abilities: ['Identify Artifact', 'Recall Legend', 'Cultural Insight']
  },
  {
    id: 'skill5',
    name: 'Alchemy',
    level: 2,
    experience: 50,
    nextLevelExp: 100,
    description: 'Creation of potions, poisons, and other magical concoctions.',
    category: 'crafting',
    abilities: ['Healing Potion', 'Explosive Vial']
  }
];

const initialStats: CharacterStats = {
  strength: 12,
  dexterity: 14,
  constitution: 10,
  intelligence: 16,
  wisdom: 13,
  charisma: 15
};

const CharacterProgression: React.FC = () => {
  const [characterLevel, setCharacterLevel] = useState(5);
  const [experience, setExperience] = useState(750);
  const [nextLevelExp, setNextLevelExp] = useState(1000);
  const [skillPoints, setSkillPoints] = useState(3);
  const [statPoints, setStatPoints] = useState(2);
  const [skills, setSkills] = useState<CharacterSkill[]>(sampleSkills);
  const [stats, setStats] = useState<CharacterStats>(initialStats);
  const { toast } = useToast();

  const handleLevelUpSkill = (skillId: string) => {
    if (skillPoints <= 0) {
      toast({
        title: "No Skill Points Available",
        description: "You need to earn more skill points before leveling up skills.",
        variant: "destructive"
      });
      return;
    }

    setSkills(skills.map(skill => {
      if (skill.id === skillId) {
        return {
          ...skill,
          level: skill.level + 1,
          experience: 0,
          nextLevelExp: skill.nextLevelExp + 100,
          abilities: skill.level === 3 ? 
            [...skill.abilities, `New Level 4 Ability`] : 
            skill.abilities
        };
      }
      return skill;
    }));
    
    setSkillPoints(skillPoints - 1);
    
    toast({
      title: "Skill Improved!",
      description: `Your skill has been advanced to a new level.`,
    });
  };

  const handleIncreaseStat = (statName: keyof CharacterStats) => {
    if (statPoints <= 0) {
      toast({
        title: "No Stat Points Available",
        description: "You need to earn more stat points before increasing abilities.",
        variant: "destructive"
      });
      return;
    }

    setStats({
      ...stats,
      [statName]: stats[statName] + 1
    });
    
    setStatPoints(statPoints - 1);
    
    toast({
      title: "Stat Increased!",
      description: `Your ${statName} has been increased.`,
    });
  };

  const getSkillCategoryIcon = (category: string) => {
    switch(category) {
      case 'combat': return <Swords className="h-4 w-4" />;
      case 'magic': return <Sparkles className="h-4 w-4" />;
      case 'social': return <Heart className="h-4 w-4" />;
      case 'knowledge': return <BookOpen className="h-4 w-4" />;
      case 'crafting': return <Bookmark className="h-4 w-4" />;
      default: return <Bookmark className="h-4 w-4" />;
    }
  };

  const getSkillCategoryColor = (category: string) => {
    switch(category) {
      case 'combat': return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'magic': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'social': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'knowledge': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'crafting': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold text-amber-900">Character Progression</h2>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-100 text-amber-800 border-amber-300">
            <Award className="mr-1 h-4 w-4" />
            Level {characterLevel}
          </Badge>
          <Badge variant="outline">
            <Zap className="mr-1 h-4 w-4" />
            {skillPoints} Skill Points
          </Badge>
          <Badge variant="outline">
            <BarChart3 className="mr-1 h-4 w-4" />
            {statPoints} Stat Points
          </Badge>
        </div>
      </div>

      {/* Experience Progress */}
      <Card className="parchment">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-serif text-amber-900">Experience</CardTitle>
          <CardDescription>
            Progress toward next level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm mb-2">
            <span>Level {characterLevel}</span>
            <span>{experience}/{nextLevelExp} XP</span>
          </div>
          <Progress value={(experience / nextLevelExp) * 100} className="h-2" />
          
          <div className="mt-4 text-sm text-stone-700">
            <p>Gain experience by completing roleplay sessions, challenges, and special events.</p>
          </div>
        </CardContent>
      </Card>

      {/* Stats & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Stats */}
        <Card className="parchment">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-serif text-amber-900">Character Stats</CardTitle>
            <CardDescription>
              Core attributes that define your character
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats).map(([statName, value]) => (
                <div key={statName} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {statName === 'strength' && <Swords className="h-4 w-4 text-amber-700" />}
                    {statName === 'dexterity' && <TrendingUp className="h-4 w-4 text-amber-700" />}
                    {statName === 'constitution' && <Shield className="h-4 w-4 text-amber-700" />}
                    {statName === 'intelligence' && <Brain className="h-4 w-4 text-amber-700" />}
                    {statName === 'wisdom' && <BookOpen className="h-4 w-4 text-amber-700" />}
                    {statName === 'charisma' && <Heart className="h-4 w-4 text-amber-700" />}
                    <span className="capitalize font-medium">{statName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-center">{value}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 w-7 p-0"
                      disabled={statPoints <= 0}
                      onClick={() => handleIncreaseStat(statName as keyof CharacterStats)}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Character Skills */}
        <div className="space-y-4">
          <h3 className="font-serif font-medium text-amber-900">Skills</h3>
          
          {skills.map((skill) => (
            <Card key={skill.id} className="parchment">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-serif text-amber-900">{skill.name}</CardTitle>
                    <Badge variant="outline" className={getSkillCategoryColor(skill.category)}>
                      {getSkillCategoryIcon(skill.category)}
                      <span className="ml-1 capitalize">{skill.category}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Level {skill.level}</Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      disabled={skillPoints <= 0}
                      onClick={() => handleLevelUpSkill(skill.id)}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-stone-700 mb-2">{skill.description}</p>
                
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{skill.experience}/{skill.nextLevelExp} XP</span>
                </div>
                <Progress value={(skill.experience / skill.nextLevelExp) * 100} className="h-1.5" />
                
                <div className="mt-3">
                  <h4 className="text-xs font-medium mb-1">Abilities:</h4>
                  <div className="flex flex-wrap gap-1">
                    {skill.abilities.map((ability, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{ability}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterProgression;
