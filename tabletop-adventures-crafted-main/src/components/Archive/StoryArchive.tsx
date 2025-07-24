
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Book, BookOpen, Calendar, Heart, Star, 
  BookType, Search, ArrowUpDown, Bookmark
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ArchivedStory {
  id: string;
  title: string;
  excerpt: string;
  dateArchived: string;
  type: 'dnd' | 'relationship' | 'romantic' | 'beauty-beast' | 'intimacy' | 'fantasy' | 'growth';
  characters: string[];
  wordCount: number;
  likes: number;
  tags: string[];
  coverImage?: string;
  isFavorite: boolean;
}

// Sample data
const sampleStories: ArchivedStory[] = [
  {
    id: '1',
    title: 'The Lost Crown of Eldoria',
    excerpt: 'As the party ventured deeper into the ancient ruins, the air grew thick with magic and untold secrets...',
    dateArchived: '2024-04-15',
    type: 'dnd',
    characters: ['Lyra Moonwhisper', 'Thorne Darkblade', 'Elena Rivers'],
    wordCount: 3245,
    likes: 17,
    tags: ['adventure', 'magic', 'dungeon'],
    coverImage: 'https://placehold.co/300x200/2D3748/FFFFFF?text=Eldoria&font=playfair',
    isFavorite: true
  },
  {
    id: '2',
    title: 'Whispers of the Heart',
    excerpt: 'Under the moonlit sky, their eyes met, and in that moment, time seemed to stand still...',
    dateArchived: '2024-04-10',
    type: 'romantic',
    characters: ['Sarah', 'James'],
    wordCount: 2187,
    likes: 23,
    tags: ['romance', 'heartfelt', 'moonlight'],
    coverImage: 'https://placehold.co/300x200/553C9A/FFFFFF?text=Whispers&font=playfair',
    isFavorite: false
  },
  {
    id: '3',
    title: 'Shadows of the Mind',
    excerpt: 'The journey inward revealed fears long buried, but also strengths never before realized...',
    dateArchived: '2024-04-05',
    type: 'growth',
    characters: ['Alex'],
    wordCount: 1856,
    likes: 14,
    tags: ['personal-growth', 'reflection', 'healing'],
    coverImage: 'https://placehold.co/300x200/1A365D/FFFFFF?text=Shadows&font=playfair',
    isFavorite: true
  },
  {
    id: '4',
    title: "Beauty's Embrace",
    excerpt: 'Beyond the monstrous exterior lay a soul yearning for connection and understanding...',
    dateArchived: '2024-03-28',
    type: 'beauty-beast',
    characters: ['Belle', 'Beast'],
    wordCount: 2956,
    likes: 19,
    tags: ['transformation', 'compassion', 'acceptance'],
    coverImage: 'https://placehold.co/300x200/742A2A/FFFFFF?text=Beauty&font=playfair',
    isFavorite: false
  }
];

const StoryArchive: React.FC = () => {
  const [stories, setStories] = useState<ArchivedStory[]>(sampleStories);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'title'>('date');
  const [filterType, setFilterType] = useState<string | null>(null);

  const handleToggleFavorite = (id: string) => {
    setStories(stories.map(story => 
      story.id === id ? {...story, isFavorite: !story.isFavorite} : story
    ));
  };

  const filteredStories = stories.filter(story => 
    (searchTerm === '' || 
     story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     story.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!filterType || story.type === filterType)
  );

  const sortedStories = [...filteredStories].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.dateArchived).getTime() - new Date(a.dateArchived).getTime();
    } else if (sortBy === 'likes') {
      return b.likes - a.likes;
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'dnd': return <BookType className="h-4 w-4" />;
      case 'romantic': return <Heart className="h-4 w-4" />;
      case 'growth': return <BookOpen className="h-4 w-4" />;
      case 'beauty-beast': return <Book className="h-4 w-4" />;
      default: return <Book className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'dnd': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'romantic': return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'growth': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'beauty-beast': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'relationship': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'intimacy': return 'bg-pink-100 text-pink-800 border-pink-300';
      case 'fantasy': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold text-amber-900">Story Archive</h2>
        <Button variant="outline" className="text-amber-800">
          <Bookmark className="mr-2 h-4 w-4" />
          Archive Current Story
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search archived stories..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                {filterType ? `Filter: ${filterType}` : "All Types"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60">
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setFilterType(null)}
                >
                  All Types
                </Button>
                {['dnd', 'romantic', 'growth', 'beauty-beast', 'relationship', 'intimacy', 'fantasy'].map(type => (
                  <Button 
                    key={type} 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setFilterType(type)}
                  >
                    {getTypeIcon(type)}
                    <span className="ml-2 capitalize">{type.replace('-', ' & ')}</span>
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort By
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('date')}>
                <Calendar className="mr-2 h-4 w-4" />
                Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('likes')}>
                <Heart className="mr-2 h-4 w-4" />
                Popularity
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('title')}>
                <BookType className="mr-2 h-4 w-4" />
                Title
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {sortedStories.length === 0 ? (
        <Card className="parchment text-center p-6">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No archived stories found.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedStories.map((story) => (
            <Card key={story.id} className="parchment fantasy-shadow overflow-hidden h-full flex flex-col">
              {story.coverImage && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={story.coverImage} 
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={`absolute top-2 right-2 ${story.isFavorite ? 'text-amber-500' : 'text-gray-400'}`}
                    onClick={() => handleToggleFavorite(story.id)}
                  >
                    <Star className={story.isFavorite ? 'fill-amber-500' : ''} />
                  </Button>
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-serif text-amber-900">{story.title}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="outline" className={getTypeColor(story.type)}>
                    {getTypeIcon(story.type)}
                    <span className="ml-1 capitalize">{story.type.replace('-', ' & ')}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-stone-700 line-clamp-3">{story.excerpt}</p>
                
                <div className="mt-4 flex flex-wrap gap-1">
                  {story.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <div className="p-3 pt-0 border-t border-amber-100 mt-auto">
                <div className="flex justify-between items-center text-xs text-stone-600">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(story.dateArchived)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {story.wordCount} words
                    </span>
                    <span className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {story.likes}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryArchive;
