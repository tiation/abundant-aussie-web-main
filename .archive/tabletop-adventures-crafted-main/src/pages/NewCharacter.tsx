
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CharacterClass, Race, Alignment } from '@/utils/dndTypes';

const characterClasses: CharacterClass[] = [
  "Barbarian", "Bard", "Cleric", "Druid", "Fighter", 
  "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"
];

const races: Race[] = [
  "Dragonborn", "Dwarf", "Elf", "Gnome", "Half-Elf",
  "Half-Orc", "Halfling", "Human", "Tiefling"
];

const alignments: Alignment[] = [
  "Lawful Good", "Neutral Good", "Chaotic Good",
  "Lawful Neutral", "True Neutral", "Chaotic Neutral",
  "Lawful Evil", "Neutral Evil", "Chaotic Evil"
];

const backgrounds = [
  "Acolyte", "Charlatan", "Criminal", "Entertainer", 
  "Folk Hero", "Guild Artisan", "Hermit", "Noble", 
  "Outlander", "Sage", "Sailor", "Soldier", "Urchin"
];

const NewCharacter: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-serif font-bold text-amber-900">Create New Character</h1>
      </div>
      
      <form className="space-y-6">
        <Card className="parchment">
          <CardHeader className="py-3 px-6 bg-amber-100/50 border-b border-amber-800/10">
            <h2 className="font-serif font-bold text-amber-900 text-xl">Character Basics</h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="name">Character Name</Label>
                  <Input id="name" placeholder="Enter character name" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="race">Race</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select race" />
                      </SelectTrigger>
                      <SelectContent>
                        {races.map((race) => (
                          <SelectItem key={race} value={race}>{race}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="class">Class</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {characterClasses.map((charClass) => (
                          <SelectItem key={charClass} value={charClass}>{charClass}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="background">Background</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select background" />
                      </SelectTrigger>
                      <SelectContent>
                        {backgrounds.map((bg) => (
                          <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="alignment">Alignment</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select alignment" />
                      </SelectTrigger>
                      <SelectContent>
                        {alignments.map((alignment) => (
                          <SelectItem key={alignment} value={alignment}>{alignment}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="level">Level</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 20 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="experience">Experience Points</Label>
                    <Input id="experience" type="number" defaultValue="0" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="font-serif font-bold text-amber-900">Ability Scores</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  {["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"].map(ability => (
                    <div key={ability} className="space-y-1">
                      <Label htmlFor={ability.toLowerCase()}>{ability}</Label>
                      <Input 
                        id={ability.toLowerCase()} 
                        type="number" 
                        defaultValue="10" 
                        min="1" 
                        max="30"
                        className="text-center" 
                      />
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="font-serif font-bold text-amber-900 mb-2">Avatar Image</h3>
                  <div className="border-2 border-dashed border-amber-800/30 rounded-lg p-4 text-center">
                    <p className="text-stone-600 mb-2">Drop an image or click to browse</p>
                    <Button variant="secondary" className="w-full">
                      Upload Image
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button type="button" onClick={() => navigate('/')}>
            Create Character
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewCharacter;
