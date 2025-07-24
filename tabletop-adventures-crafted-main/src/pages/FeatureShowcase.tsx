
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeSwitcher from '../components/Theme/ThemeSwitcher';
import VoiceRecorder from '../components/Voice/VoiceRecorder';
import StoryArchive from '../components/Archive/StoryArchive';
import CommunityChallenges from '../components/Community/CommunityChallenges';
import SeasonalEvents from '../components/Events/SeasonalEvents';
import CharacterProgression from '../components/Progression/CharacterProgression';
import CharacterCrossover from '../components/CrossCharacter/CharacterCrossover';
import { CharacterProfile } from '@/types/roleplay';
import { useToast } from '@/components/ui/use-toast';

// Sample Character Profiles for the CrossCharacter Feature
const sampleCharacters: CharacterProfile[] = [
  {
    id: 'prof1',
    name: 'Lyra Moonwhisper',
    avatar: '/avatar.png', 
    backstory: 'A mysterious elven sorceress with a troubled past, seeking redemption through magical adventures and forging new connections.',
    personality: ['Creative', 'Mysterious', 'Passionate', 'Detailed'],
    preferences: ['Fantasy', 'Romance', 'Adventure', 'Character Development'],
    level: 7,
    experience: 450,
    badges: ['Master Storyteller', 'Fantasy Expert', 'Creative Writer', 'Character Creator'],
    achievements: ['story_master', 'first_100_posts', 'creative_genius'],
    createdAt: '2023-12-10',
    stats: {
      creativity: 8.5,
      consistency: 7,
      depth: 9,
      interaction: 8,
      popularity: 92
    }
  },
  {
    id: 'prof2',
    name: 'Thorne Darkblade',
    avatar: '/avatar.png',
    backstory: 'A shadowy rogue with a mysterious past who now seeks redemption through heroic deeds.',
    personality: ['Brooding', 'Loyal', 'Strategic', 'Reserved'],
    preferences: ['Adventure', 'Intrigue', 'Combat', 'Redemption Arc'],
    level: 8,
    experience: 650,
    badges: ['Combat Master', 'Shadow Walker'],
    achievements: ['master_thief', 'shadow_dancer'],
    createdAt: '2024-01-15',
    stats: {
      creativity: 7,
      consistency: 8.5,
      depth: 8,
      interaction: 7,
      popularity: 85
    }
  },
  {
    id: 'prof3',
    name: 'Elena Rivers',
    avatar: '/avatar.png',
    backstory: 'A talented healer whose village was destroyed, now traveling the world to spread compassion and healing.',
    personality: ['Kind', 'Wise', 'Determined', 'Peaceful'],
    preferences: ['Healing', 'Nature', 'Diplomacy', 'Growth'],
    level: 6,
    experience: 350,
    badges: ['Healing Touch', 'Nature Friend'],
    achievements: ['master_healer', 'plant_whisperer'],
    createdAt: '2024-02-10',
    stats: {
      creativity: 6.5,
      consistency: 9,
      depth: 7.5,
      interaction: 9,
      popularity: 88
    }
  }
];

const FeatureShowcase: React.FC = () => {
  const { toast } = useToast();
  
  const handleVoiceSave = (audioBlob: Blob) => {
    toast({
      title: "Voice Recording Saved",
      description: "Your voice message has been saved to the conversation.",
    });
    console.log("Audio blob saved:", audioBlob);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold text-amber-900">New Features Showcase</h1>
      
      <Tabs defaultValue="themes">
        <TabsList className="grid grid-cols-7 mb-6 w-full">
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="progression">Progression</TabsTrigger>
          <TabsTrigger value="crossover">Crossovers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="themes" className="space-y-6">
          <Card className="parchment">
            <CardHeader>
              <CardTitle>Customizable UI Themes</CardTitle>
              <CardDescription>
                Personalize your roleplay environment with different visual themes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-stone-700">
                Choose from different themes to customize the look and feel of your roleplay experience.
                Each theme affects colors, shadows, backgrounds and overall aesthetic of the application.
              </p>
              
              <ThemeSwitcher />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="voice" className="space-y-6">
          <Card className="parchment">
            <CardHeader>
              <CardTitle>Voice Message Integration</CardTitle>
              <CardDescription>
                Add voice recordings to your roleplay sessions for a more immersive experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceRecorder onSave={handleVoiceSave} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="archive" className="space-y-6">
          <StoryArchive />
        </TabsContent>
        
        <TabsContent value="challenges" className="space-y-6">
          <CommunityChallenges />
        </TabsContent>
        
        <TabsContent value="events" className="space-y-6">
          <SeasonalEvents />
        </TabsContent>
        
        <TabsContent value="progression" className="space-y-6">
          <CharacterProgression />
        </TabsContent>
        
        <TabsContent value="crossover" className="space-y-6">
          <CharacterCrossover characters={sampleCharacters} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeatureShowcase;
