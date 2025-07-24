
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, Book, CirclePlay, Clock, Star, Users, 
  HeartHandshake, Flame, Rocket, MessageSquare
} from 'lucide-react';
import { RoleplayScenario } from '@/types/roleplay';
import { toast } from "@/hooks/use-toast";

interface InteractiveScenariosProps {
  scenarios: RoleplayScenario[];
}

const InteractiveScenarios: React.FC<InteractiveScenariosProps> = ({ scenarios }) => {
  const [selectedScenario, setSelectedScenario] = useState<RoleplayScenario | null>(null);
  
  const handleScenarioSelect = (scenario: RoleplayScenario) => {
    setSelectedScenario(scenario);
  };
  
  const handleStartScenario = () => {
    if (selectedScenario) {
      toast({
        title: "Scenario started!",
        description: `Starting "${selectedScenario.title}". Get ready to roleplay!`,
      });
    }
  };
  
  const getScenarioIcon = (type: string) => {
    switch(type) {
      case 'dnd': return <MessageSquare className="h-5 w-5" />;
      case 'relationship': return <HeartHandshake className="h-5 w-5" />;
      case 'romantic': return <Star className="h-5 w-5" />;
      case 'beauty-beast': return <Book className="h-5 w-5" />;
      case 'intimacy': return <HeartHandshake className="h-5 w-5" />;
      case 'fantasy': return <Flame className="h-5 w-5" />;
      case 'growth': return <Rocket className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };
  
  const getScenarioColor = (type: string) => {
    switch(type) {
      case 'dnd': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'relationship': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'romantic': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'beauty-beast': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'intimacy': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'fantasy': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'growth': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };
  
  return (
    <Card className="scenarios-card bg-gradient-to-br from-blue-50 to-indigo-50 fantasy-shadow">
      <CardHeader className="py-3 px-6 bg-gradient-to-r from-blue-200/40 to-indigo-200/40 border-b border-blue-300/20">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-blue-900 text-xl flex items-center gap-2">
            <Book className="w-5 h-5" />
            Interactive Scenarios
          </h3>
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
            {scenarios.length} Available
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[500px]">
          {/* Scenarios List */}
          <div className="col-span-1 border-r border-blue-100">
            <ScrollArea className="h-[500px] p-4">
              <div className="space-y-3">
                {scenarios.map((scenario) => (
                  <div 
                    key={scenario.id}
                    className={`p-3 rounded-md cursor-pointer transition-all hover:bg-blue-50 ${
                      selectedScenario?.id === scenario.id 
                        ? 'border-2 border-blue-400 bg-blue-50/80' 
                        : 'border border-blue-100 bg-white/60'
                    }`}
                    onClick={() => handleScenarioSelect(scenario)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant="outline" 
                        className={getScenarioColor(scenario.type)}
                      >
                        {getScenarioIcon(scenario.type)}
                        <span className="ml-1 capitalize">{scenario.type}</span>
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${scenario.difficulty === 'beginner' ? 'bg-green-50 text-green-700 border-green-200' : 
                            scenario.difficulty === 'intermediate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-rose-50 text-rose-700 border-rose-200'}
                        `}
                      >
                        {scenario.difficulty}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-blue-900">{scenario.title}</h4>
                    <div className="flex items-center justify-between mt-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>2-4 players</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{scenario.popularity}/10</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>~30 min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          {/* Scenario Details */}
          <div className="col-span-2 h-[500px] flex flex-col">
            {selectedScenario ? (
              <>
                <div 
                  className="h-[200px] bg-cover bg-center p-6 flex items-end"
                  style={{
                    backgroundImage: selectedScenario.backgroundImage 
                      ? `url(${selectedScenario.backgroundImage})` 
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  <div className="bg-black/30 p-4 rounded-lg backdrop-blur-sm w-full">
                    <h3 className="text-xl font-bold text-white">{selectedScenario.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className="bg-blue-500/80 text-white border-none">
                        {selectedScenario.type}
                      </Badge>
                      <Badge className="bg-indigo-500/80 text-white border-none">
                        {selectedScenario.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6 flex flex-col">
                  <div className="prose prose-sm max-w-none mb-4 flex-1">
                    <h4 className="text-lg font-medium text-blue-900 mb-2">Description</h4>
                    <p className="text-slate-700">{selectedScenario.description}</p>
                    
                    <h4 className="text-lg font-medium text-blue-900 mt-4 mb-2">Suggested Characters</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedScenario.suggestedCharacters.map((character, i) => (
                        <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700">
                          {character}
                        </Badge>
                      ))}
                    </div>
                    
                    <h4 className="text-lg font-medium text-blue-900 mb-2">Starting Prompts</h4>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700">
                      {selectedScenario.startingPrompts.map((prompt, i) => (
                        <li key={i}>{prompt}</li>
                      ))}
                    </ul>
                    
                    {selectedScenario.interactiveElements?.choices && (
                      <>
                        <h4 className="text-lg font-medium text-blue-900 mt-4 mb-2">Interactive Elements</h4>
                        <div className="bg-blue-50/50 p-3 rounded-md border border-blue-100">
                          <p className="text-sm text-blue-800 mb-2">This scenario includes interactive choices that will affect how your story unfolds.</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedScenario.interactiveElements.choices.slice(0, 3).map((choice, i) => (
                              <Badge key={i} className="bg-blue-100/60 text-blue-800 border-blue-200">
                                {choice}...
                              </Badge>
                            ))}
                            {selectedScenario.interactiveElements.choices.length > 3 && (
                              <Badge className="bg-blue-100/60 text-blue-800 border-blue-200">
                                +{selectedScenario.interactiveElements.choices.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="border-t border-blue-100 pt-4 mt-auto">
                    <Button 
                      onClick={handleStartScenario}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <CirclePlay className="mr-2 h-4 w-4" />
                      Start this Scenario
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center flex-col p-6 text-center">
                <Book className="h-16 w-16 text-blue-200 mb-4" />
                <h4 className="text-xl font-medium text-blue-900 mb-2">Select a Scenario</h4>
                <p className="text-slate-600">Choose a scenario from the list to see its details and get started with your roleplay adventure.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveScenarios;
