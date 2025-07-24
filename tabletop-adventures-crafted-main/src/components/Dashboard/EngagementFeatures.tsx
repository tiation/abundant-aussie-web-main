
import React from 'react';
import CharacterProfile from '../Roleplay/CharacterProfile';
import AchievementSystem from '../Roleplay/AchievementSystem';
import RoleplayMatchmaking from '../Roleplay/RoleplayMatchmaking';
import InteractiveScenarios from '../Roleplay/InteractiveScenarios';
import { CharacterProfile as CharacterProfileType, Achievement, RoleplayScenario } from '@/types/roleplay';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

// Sample Character Profile
const sampleProfile: CharacterProfileType = {
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
};

// Sample Achievements
const sampleAchievements: Achievement[] = [
  {
    id: 'story_master',
    title: 'Story Master',
    description: 'Complete 50 roleplay sessions',
    icon: 'trophy',
    unlocked: true,
    dateUnlocked: '2024-03-15',
    category: 'master',
    rarity: 'epic'
  },
  {
    id: 'first_100_posts',
    title: 'Prolific Writer',
    description: 'Write 100 roleplay posts',
    icon: 'pen',
    unlocked: true,
    dateUnlocked: '2024-02-20',
    category: 'writer',
    rarity: 'uncommon'
  },
  {
    id: 'creative_genius',
    title: 'Creative Genius',
    description: 'Receive 25 compliments on your creativity',
    icon: 'star',
    unlocked: true,
    dateUnlocked: '2024-03-05',
    category: 'creator',
    rarity: 'rare'
  },
  {
    id: 'explorer',
    title: 'Genre Explorer',
    description: 'Try all roleplay types at least once',
    icon: 'compass',
    unlocked: true,
    progress: 7,
    maxProgress: 7,
    dateUnlocked: '2024-04-01',
    category: 'explorer',
    rarity: 'uncommon'
  },
  {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    description: 'Roleplay with 10 different partners',
    icon: 'users',
    unlocked: false,
    progress: 7,
    maxProgress: 10,
    category: 'social',
    rarity: 'common'
  },
  {
    id: 'legendary_storyteller',
    title: 'Legendary Storyteller',
    description: 'Complete a continuous roleplay with 100+ posts',
    icon: 'book',
    unlocked: false,
    progress: 67,
    maxProgress: 100,
    category: 'writer',
    rarity: 'legendary'
  },
  {
    id: 'character_developer',
    title: 'Character Developer',
    description: 'Create detailed profiles for 5 characters',
    icon: 'user',
    unlocked: true,
    progress: 5,
    maxProgress: 5,
    dateUnlocked: '2024-01-25',
    category: 'creator',
    rarity: 'common'
  },
  {
    id: 'fantasy_master',
    title: 'Fantasy Master',
    description: 'Receive excellent reviews in 20 fantasy roleplays',
    icon: 'wand',
    unlocked: false,
    progress: 14,
    maxProgress: 20,
    category: 'master',
    rarity: 'rare'
  }
];

// Sample Roleplay Partners
const samplePartners = [
  {
    id: 'partner1',
    profile: {
      id: 'user1',
      name: 'Thorne Darkblade',
      avatar: '/avatar.png',
      backstory: 'A shadowy rogue with a mysterious past.',
      personality: ['Creative', 'Mysterious', 'Detailed'],
      preferences: ['Fantasy', 'Adventure'],
      level: 8,
      experience: 650,
      badges: ['Creative Writer'],
      achievements: ['explorer', 'story_master'],
      createdAt: '2024-01-15',
      stats: {
        creativity: 9,
        consistency: 7,
        depth: 8,
        interaction: 8,
        popularity: 87
      }
    },
    matchScore: 92,
    activeTime: 'Last active: 5 min ago',
    preferredScenarios: ['Fantasy Adventure', 'Dark Fantasy', 'Mystery'],
    roleplayStyle: ['Descriptive', 'Character-focused', 'Plot-driven'],
    availability: 'now' as const
  },
  {
    id: 'partner2',
    profile: {
      id: 'user2',
      name: 'Elena Rivers',
      avatar: '/avatar.png',
      backstory: 'A compassionate healer with a gift for empathy.',
      personality: ['Supportive', 'Creative', 'Empathetic'],
      preferences: ['Growth', 'Emotional', 'Development'],
      level: 6,
      experience: 420,
      badges: ['Supportive Partner'],
      achievements: ['social_butterfly', 'character_developer'],
      createdAt: '2024-02-10',
      stats: {
        creativity: 8,
        consistency: 9,
        depth: 9,
        interaction: 9,
        popularity: 90
      }
    },
    matchScore: 88,
    activeTime: 'Last active: 20 min ago',
    preferredScenarios: ['Personal Growth', 'Emotional Journey', 'Healing Arc'],
    roleplayStyle: ['Supportive', 'Reflective', 'Character Development'],
    availability: 'now' as const
  },
  {
    id: 'partner3',
    profile: {
      id: 'user3',
      name: 'Marcus Flame',
      avatar: '/avatar.png',
      backstory: 'A passionate adventurer with a fiery spirit.',
      personality: ['Bold', 'Creative', 'Adventurous'],
      preferences: ['Fantasy', 'Adventure', 'Romance'],
      level: 9,
      experience: 780,
      badges: ['Fantasy Expert'],
      achievements: ['legendary_storyteller', 'fantasy_master'],
      createdAt: '2023-11-05',
      stats: {
        creativity: 9,
        consistency: 7,
        depth: 8,
        interaction: 8,
        popularity: 95
      }
    },
    matchScore: 85,
    activeTime: 'Last active: 1 hour ago',
    preferredScenarios: ['Fantasy Adventure', 'Romance', 'Epic Quest'],
    roleplayStyle: ['Immersive', 'Detailed', 'Action-packed'],
    availability: 'soon' as const
  }
];

// Sample Scenarios
const sampleScenarios: RoleplayScenario[] = [
  {
    id: 'scenario1',
    title: 'The Enchanted Forest Mystery',
    description: 'Strange lights have been seen in the ancient forest, and locals whisper of magical creatures appearing at night. Your party has been hired to investigate these occurrences and determine if they pose any danger to nearby villages.',
    type: 'dnd',
    backgroundImage: 'linear-gradient(135deg, #44853E 0%, #155263 100%)',
    difficulty: 'intermediate',
    popularity: 8,
    suggestedCharacters: ['Wizard', 'Ranger', 'Druid', 'Bard'],
    startingPrompts: [
      'Your party arrives at the edge of the forest as dusk falls...',
      'A local guide shares tales of strange glowing figures dancing among the trees...',
      'An ancient stone marker bears warnings in a language long forgotten...'
    ],
    interactiveElements: {
      choices: [
        'Follow the lights deeper into the forest',
        'Set up camp and wait for the creatures to appear',
        'Seek out the local forest keeper for advice',
        'Perform a ritual to commune with forest spirits'
      ],
      outcomes: {
        'Follow the lights': 'You discover a hidden fairy glade...',
        'Set up camp': 'In the night, curious sprites investigate your camp...',
        'Seek forest keeper': 'The reclusive keeper shares ancient knowledge...',
        'Perform ritual': 'The spirits respond to your call, but not all are friendly...'
      },
      triggers: ['night_time', 'full_moon', 'magic_detected']
    }
  },
  {
    id: 'scenario2',
    title: 'Breaking Free: Journey to Self-Acceptance',
    description: 'A therapeutic roleplay scenario focused on overcoming negative self-perceptions and embracing your authentic self. Through guided dialogue and reflective exercises, explore the journey to self-acceptance and personal growth.',
    type: 'growth',
    backgroundImage: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
    difficulty: 'beginner',
    popularity: 9,
    suggestedCharacters: ['Seeker', 'Guide', 'Inner Voice', 'Past Self'],
    startingPrompts: [
      'Describe a moment when you felt most limited by your own self-perception...',
      'Imagine meeting your future self who has overcome current struggles...',
      'Visualize a place where you feel completely free to be yourself...'
    ],
    interactiveElements: {
      choices: [
        'Confront a limiting belief',
        'Practice self-compassion dialogue',
        'Visualize achieving a personal goal',
        'Create a mantra for difficult moments'
      ],
      outcomes: {
        'Confront belief': 'You recognize the origins of this belief...',
        'Self-compassion': 'Speaking kindly to yourself reveals deeper needs...',
        'Visualize goal': 'The clarity of your vision provides motivation...',
        'Create mantra': 'Your personal mantra becomes an anchor in challenging times...'
      },
      triggers: ['emotional_breakthrough', 'realization', 'acceptance_moment']
    }
  },
  {
    id: 'scenario3',
    title: 'Midnight Desires: Fantasy Fulfillment',
    description: 'An intimate exploration of personal fantasies in a safe, consensual space. This scenario allows partners to share and enact desires with clear boundaries and communication throughout the experience.',
    type: 'fantasy',
    backgroundImage: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
    difficulty: 'advanced',
    popularity: 9,
    suggestedCharacters: ['Seducer', 'Admirer', 'Stranger', 'Confidant'],
    startingPrompts: [
      'The room is dimly lit, the air thick with anticipation as you enter...',
      'A note arrives with instructions for an evening of sensual exploration...',
      'Eyes meet across the crowded space, an instant connection forming...'
    ],
    interactiveElements: {
      choices: [
        'Take control of the encounter',
        'Surrender to the moment',
        'Share a hidden desire',
        'Establish boundaries before proceeding'
      ],
      outcomes: {
        'Take control': 'Your confidence guides the experience...',
        'Surrender': 'Letting go opens new realms of pleasure...',
        'Share desire': 'Vulnerability leads to deeper connection...',
        'Establish boundaries': 'Clear communication enhances trust and intimacy...'
      },
      triggers: ['passion_increased', 'connection_deepened', 'fantasy_fulfilled']
    }
  }
];

const EngagementFeatures: React.FC = () => {
  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold text-amber-900">Engagement Features</h2>
          <Button variant="outline" className="text-amber-800">
            View All Features <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CharacterProfile profile={sampleProfile} />
          <AchievementSystem achievements={sampleAchievements} />
        </div>
      </div>
      
      <RoleplayMatchmaking 
        userProfile={sampleProfile}
        suggestedPartners={samplePartners}
      />
      
      <InteractiveScenarios scenarios={sampleScenarios} />
    </div>
  );
};

export default EngagementFeatures;
