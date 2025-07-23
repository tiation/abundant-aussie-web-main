
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Award, Sparkles, Star, CalendarDays } from 'lucide-react';

interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  theme: string;
  rewards: {
    xp: number;
    badges?: string[];
    items?: string[];
  };
  scenarios: string[];
  isActive: boolean;
  image: string;
  progress?: number;
}

const sampleEvents: SeasonalEvent[] = [
  {
    id: 'event1',
    name: 'Summer Solstice Festival',
    description: 'Celebrate the longest day of the year with special summer-themed scenarios, magical festivals, and unique character developments.',
    startDate: '2025-06-20',
    endDate: '2025-07-04',
    theme: 'Summer Magic',
    rewards: {
      xp: 1000,
      badges: ['Summer Champion', 'Solstice Mage'],
      items: ['Sun Crown', 'Phoenix Feather']
    },
    scenarios: [
      'The Midsummer Night\'s Dream',
      'Phoenix Rising',
      'The Summer Court Ball'
    ],
    isActive: true,
    image: 'https://placehold.co/600x400/FFB347/FFFFFF?text=Summer+Solstice&font=playfair',
    progress: 35
  },
  {
    id: 'event2',
    name: 'Harvest Moon Mystery',
    description: 'As the harvest moon rises, strange occurrences plague the countryside. Solve mysteries and uncover secrets in this autumn-themed event.',
    startDate: '2025-09-15',
    endDate: '2025-10-10',
    theme: 'Autumn Mysteries',
    rewards: {
      xp: 800,
      badges: ['Moon Detective', 'Harvest Hero'],
      items: ['Lunar Amulet', 'Detective\'s Journal']
    },
    scenarios: [
      'The Vanishing Harvest',
      'Moonlit Apparitions',
      'The Scarecrow\'s Secret'
    ],
    isActive: false,
    image: 'https://placehold.co/600x400/B85C38/FFFFFF?text=Harvest+Moon&font=playfair'
  },
  {
    id: 'event3',
    name: "Winter's Embrace",
    description: 'Venture through a snow-covered landscape where magic grows stronger as the year comes to an end. Discover winter wonders and face chilling challenges.',
    startDate: '2025-12-15',
    endDate: '2026-01-05',
    theme: 'Winter Wonder',
    rewards: {
      xp: 1200,
      badges: ['Frost Mage', 'Winter Survivor'],
      items: ['Ice Crystal Staff', 'Enchanted Snow Globe']
    },
    scenarios: [
      'The Frozen Castle',
      'Midwinter Night\'s Tale',
      'The Ice Queen\'s Challenge'
    ],
    isActive: false,
    image: 'https://placehold.co/600x400/6A8EAE/FFFFFF?text=Winter+Embrace&font=playfair'
  }
];

const SeasonalEvents: React.FC = () => {
  const [participatingEvents, setParticipatingEvents] = useState<string[]>(['event1']);

  const handleParticipate = (eventId: string) => {
    if (participatingEvents.includes(eventId)) {
      setParticipatingEvents(participatingEvents.filter(id => id !== eventId));
    } else {
      setParticipatingEvents([...participatingEvents, eventId]);
    }
  };

  const isEventActive = (event: SeasonalEvent) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    return startDate <= now && endDate >= now;
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startFormatted = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(start);
    const endFormatted = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(end);
    return `${startFormatted} - ${endFormatted}`;
  };

  const getTimeRemaining = (dateString: string) => {
    const targetDate = new Date(dateString);
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Ended';
    if (diffDays === 0) return 'Today!';
    return `${diffDays} days remaining`;
  };

  const activeEvents = sampleEvents.filter(event => isEventActive(event));
  const upcomingEvents = sampleEvents.filter(event => !isEventActive(event) && new Date(event.startDate) > new Date());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold text-amber-900">Seasonal Events</h2>
        <Button variant="outline" className="text-amber-800">
          <CalendarDays className="mr-2 h-4 w-4" />
          Event Calendar
        </Button>
      </div>

      <div className="space-y-8">
        {/* Active Events */}
        {activeEvents.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-amber-900 flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-amber-500" /> 
              Active Events
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeEvents.map(event => (
                <Card key={event.id} className="parchment fantasy-shadow overflow-hidden">
                  <div className="h-48 relative">
                    <img 
                      src={event.image} 
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50"></div>
                    <Badge className="absolute top-3 right-3 bg-amber-500">
                      <Sparkles className="mr-1 h-3 w-3" /> Active Event
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-serif text-amber-900">{event.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDateRange(event.startDate, event.endDate)}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{getTimeRemaining(event.endDate)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-stone-700">{event.description}</p>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Special Scenarios:</h4>
                      <ul className="list-disc list-inside text-sm text-stone-700">
                        {event.scenarios.map((scenario, idx) => (
                          <li key={idx}>{scenario}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Rewards:</h4>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-amber-500" />
                          <span className="text-sm font-medium">{event.rewards.xp} XP</span>
                        </div>
                        {event.rewards.badges?.map((badge, idx) => (
                          <Badge key={idx} variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                            <Award className="mr-1 h-3 w-3" />
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={participatingEvents.includes(event.id) ? 'bg-amber-200 text-amber-800 hover:bg-amber-300 w-full' : 'w-full'}
                      variant={participatingEvents.includes(event.id) ? 'outline' : 'default'}
                      onClick={() => handleParticipate(event.id)}
                    >
                      {participatingEvents.includes(event.id) ? 'Leave Event' : 'Join Event'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-amber-900">Upcoming Events</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <Card key={event.id} className="parchment fantasy-shadow overflow-hidden">
                  <div className="h-36 relative">
                    <img 
                      src={event.image} 
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50"></div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-serif text-amber-900">{event.name}</CardTitle>
                    <CardDescription className="flex items-center text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDateRange(event.startDate, event.endDate)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-stone-700 line-clamp-3">{event.description}</p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Clock className="mr-2 h-4 w-4" />
                      Starts in {getTimeRemaining(event.startDate)}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonalEvents;
