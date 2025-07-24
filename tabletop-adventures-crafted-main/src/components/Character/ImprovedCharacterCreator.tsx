
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Defining types locally to fix type errors
type Race = "Dragonborn" | "Dwarf" | "Elf" | "Gnome" | "Half-Elf" | "Half-Orc" | "Halfling" | "Human" | "Tiefling";
type Class = "Barbarian" | "Bard" | "Cleric" | "Druid" | "Fighter" | "Monk" | "Paladin" | "Ranger" | "Rogue" | "Sorcerer" | "Warlock" | "Wizard";
type Alignment = "Lawful Good" | "Neutral Good" | "Chaotic Good" | "Lawful Neutral" | "True Neutral" | "Chaotic Neutral" | "Lawful Evil" | "Neutral Evil" | "Chaotic Evil";
type Background = "Acolyte" | "Charlatan" | "Criminal" | "Entertainer" | "Folk Hero" | "Guild Artisan" | "Hermit" | "Noble" | "Outlander" | "Sage" | "Sailor" | "Soldier" | "Urchin";

interface CharacterFormState {
  name: string;
  class: Class;
  race: Race;
  level: number;
  alignment: Alignment;
  background: Background;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  backstory: string;
  appearance: string;
  personality: string;
}

const ImprovedCharacterCreator: React.FC = () => {
  const [formState, setFormState] = useState<CharacterFormState>({
    name: "",
    class: "Wizard",
    race: "Human",
    level: 1,
    alignment: "True Neutral",
    background: "Sage",
    strength: 8,
    dexterity: 14,
    constitution: 12,
    intelligence: 16,
    wisdom: 13,
    charisma: 10,
    backstory: "",
    appearance: "",
    personality: ""
  });

  const generateCharacter = () => {
    const character = {
      id: `char_${Date.now()}`,
      name: formState.name || "Unnamed Character",
      class: formState.class,
      race: formState.race,
      background: formState.background,
      level: formState.level,
      alignment: formState.alignment,
      experience: 0, // Added missing property
      attributes: {
        strength: formState.strength,
        dexterity: formState.dexterity,
        constitution: formState.constitution,
        intelligence: formState.intelligence,
        wisdom: formState.wisdom,
        charisma: formState.charisma
      },
      proficiencyBonus: Math.ceil(1 + (formState.level / 4)),
      hitDice: {
        total: formState.level,
        type: "d8",
        used: 0  // Adding the missing 'used' property
      },
      savingThrows: ["Intelligence", "Wisdom"],
      skills: ["Arcana", "History", "Investigation"],
      armorClass: 10 + Math.floor((formState.dexterity - 10) / 2),
      hitPoints: {
        maximum: 8 + Math.floor((formState.constitution - 10) / 2) + ((formState.level - 1) * (5 + Math.floor((formState.constitution - 10) / 2))),
        current: 8 + Math.floor((formState.constitution - 10) / 2) + ((formState.level - 1) * (5 + Math.floor((formState.constitution - 10) / 2)))
      },
      speed: 30,
      personality: formState.personality,
      backstory: formState.backstory,
      appearance: formState.appearance,
      items: [
        {
          name: "Spellbook",
          type: "Magical Focus",
          description: "A book containing your wizard spells.",
          quantity: 1,
          weight: 3,
          value: 50,  // Changed from "50 gp" to numeric 50
          equipped: true
        },
        {
          name: "Arcane Focus",
          type: "Magical Focus",
          description: "An item used to channel magical energy.",
          quantity: 1,
          weight: 1,
          value: 10,  // Changed from "10 gp" to numeric 10
          equipped: true
        }
      ],
      features: [
        {
          name: "Arcane Recovery",
          source: "Wizard",
          description: "Once per day when you finish a short rest, you can choose expended spell slots to recover."
        }
      ],
      spells: [
        {
          name: "Mage Hand",
          level: 0,
          castTime: "1 action",
          range: "30 feet",
          duration: "1 minute",
          description: "A spectral, floating hand appears at a point you choose within range."
        },
        {
          name: "Magic Missile",
          level: 1,
          castTime: "1 action",
          range: "120 feet",
          duration: "Instantaneous",
          description: "You create three glowing darts of magical force."
        }
      ],
      avatarUrl: ""
    };

    console.log("Generated character:", character);
    // Here you would typically save the character to your database
  };

  const handleInputChange = (field: keyof CharacterFormState, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-3xl font-script text-funky-purple">Create a New Character</h1>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 pt-4">
          <Card className="parchment">
            <CardHeader className="pb-3">
              <CardTitle className="text-funky-purple">Character Basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Character Name</Label>
                  <Input 
                    id="name" 
                    value={formState.name} 
                    onChange={(e) => handleInputChange('name', e.target.value)} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="race">Race</Label>
                    <Select 
                      value={formState.race}
                      onValueChange={(value) => handleInputChange('race', value as Race)}
                    >
                      <SelectTrigger id="race">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Dragonborn", "Dwarf", "Elf", "Gnome", "Half-Elf", 
                          "Half-Orc", "Halfling", "Human", "Tiefling"].map((race) => (
                          <SelectItem key={race} value={race}>{race}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select 
                      value={formState.class}
                      onValueChange={(value) => handleInputChange('class', value as Class)}
                    >
                      <SelectTrigger id="class">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Barbarian", "Bard", "Cleric", "Druid", "Fighter", 
                          "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", 
                          "Warlock", "Wizard"].map((charClass) => (
                          <SelectItem key={charClass} value={charClass}>{charClass}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="alignment">Alignment</Label>
                    <Select 
                      value={formState.alignment}
                      onValueChange={(value) => handleInputChange('alignment', value as Alignment)}
                    >
                      <SelectTrigger id="alignment">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Lawful Good", "Neutral Good", "Chaotic Good",
                          "Lawful Neutral", "True Neutral", "Chaotic Neutral",
                          "Lawful Evil", "Neutral Evil", "Chaotic Evil"].map((alignment) => (
                          <SelectItem key={alignment} value={alignment}>{alignment}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="background">Background</Label>
                    <Select 
                      value={formState.background}
                      onValueChange={(value) => handleInputChange('background', value as CharacterBackground)}
                    >
                      <SelectTrigger id="background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Acolyte", "Charlatan", "Criminal", "Entertainer", 
                          "Folk Hero", "Guild Artisan", "Hermit", "Noble", 
                          "Outlander", "Sage", "Sailor", "Soldier", "Urchin"].map((bg) => (
                          <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select 
                    value={formState.level.toString()}
                    onValueChange={(value) => handleInputChange('level', parseInt(value))}
                  >
                    <SelectTrigger id="level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attributes" className="space-y-4 pt-4">
          <Card className="parchment">
            <CardHeader className="pb-3">
              <CardTitle className="text-funky-purple">Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { key: 'strength', label: 'Strength' },
                  { key: 'dexterity', label: 'Dexterity' },
                  { key: 'constitution', label: 'Constitution' },
                  { key: 'intelligence', label: 'Intelligence' },
                  { key: 'wisdom', label: 'Wisdom' },
                  { key: 'charisma', label: 'Charisma' }
                ].map((attr) => (
                  <div key={attr.key} className="space-y-1">
                    <Label htmlFor={attr.key}>{attr.label}</Label>
                    <div className="flex items-center">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          const currentValue = formState[attr.key as keyof typeof formState] as number;
                          if (currentValue > 3) {
                            handleInputChange(attr.key as keyof CharacterFormState, currentValue - 1);
                          }
                        }}
                        className="rounded-r-none"
                      >-</Button>
                      <Input 
                        id={attr.key}
                        type="number"
                        value={formState[attr.key as keyof typeof formState]} 
                        onChange={(e) => handleInputChange(attr.key as keyof CharacterFormState, parseInt(e.target.value) || 0)}
                        className="text-center rounded-none w-16" 
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          const currentValue = formState[attr.key as keyof typeof formState] as number;
                          if (currentValue < 20) {
                            handleInputChange(attr.key as keyof CharacterFormState, currentValue + 1);
                          }
                        }}
                        className="rounded-l-none"
                      >+</Button>
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({Math.floor((formState[attr.key as keyof typeof formState] as number - 10) / 2)})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4 pt-4">
          <Card className="parchment">
            <CardHeader className="pb-3">
              <CardTitle className="text-funky-purple">Character Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="appearance">Appearance</Label>
                <Textarea 
                  id="appearance" 
                  placeholder="Describe how your character looks..."
                  value={formState.appearance}
                  onChange={(e) => handleInputChange('appearance', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="personality">Personality</Label>
                <Textarea 
                  id="personality" 
                  placeholder="Describe your character's personality traits, ideals, bonds, and flaws..."
                  value={formState.personality}
                  onChange={(e) => handleInputChange('personality', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backstory">Backstory</Label>
                <Textarea 
                  id="backstory" 
                  placeholder="Write your character's backstory here..."
                  value={formState.backstory}
                  onChange={(e) => handleInputChange('backstory', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4 pt-4">
          <Card className="parchment">
            <CardHeader className="pb-3">
              <CardTitle className="text-funky-purple">Character Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{formState.name || "Unnamed Character"}</h3>
                  <p>Level {formState.level} {formState.race} {formState.class}</p>
                  <p>{formState.background} • {formState.alignment}</p>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-1">Ability Scores</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'strength', label: 'STR' },
                        { key: 'dexterity', label: 'DEX' },
                        { key: 'constitution', label: 'CON' },
                        { key: 'intelligence', label: 'INT' },
                        { key: 'wisdom', label: 'WIS' },
                        { key: 'charisma', label: 'CHA' }
                      ].map((attr) => (
                        <div key={attr.key} className="text-center p-2 bg-muted rounded-md">
                          <div className="text-xs font-semibold text-funky-purple">{attr.label}</div>
                          <div className="font-bold">
                            {formState[attr.key as keyof typeof formState]}
                            <span className="text-xs ml-1">
                              ({Math.floor((formState[attr.key as keyof typeof formState] as number - 10) / 2) >= 0 ? "+" : ""}
                              {Math.floor((formState[attr.key as keyof typeof formState] as number - 10) / 2)})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-1">Combat</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-muted rounded-md">
                        <div className="text-xs font-semibold text-funky-purple">AC</div>
                        <div className="font-bold">
                          {10 + Math.floor((formState.dexterity - 10) / 2)}
                        </div>
                      </div>
                      <div className="text-center p-2 bg-muted rounded-md">
                        <div className="text-xs font-semibold text-funky-purple">HP</div>
                        <div className="font-bold">
                          {8 + Math.floor((formState.constitution - 10) / 2) + ((formState.level - 1) * (5 + Math.floor((formState.constitution - 10) / 2)))}
                        </div>
                      </div>
                      <div className="text-center p-2 bg-muted rounded-md">
                        <div className="text-xs font-semibold text-funky-purple">Speed</div>
                        <div className="font-bold">30 ft</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  {formState.appearance && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-1">Appearance</h4>
                      <p className="text-sm">{formState.appearance}</p>
                    </div>
                  )}
                  
                  {formState.personality && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-1">Personality</h4>
                      <p className="text-sm">{formState.personality}</p>
                    </div>
                  )}
                  
                  {formState.backstory && (
                    <div>
                      <h4 className="font-medium mb-1">Backstory</h4>
                      <p className="text-sm">{formState.backstory}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="button" onClick={generateCharacter} className="w-full">
                  Create Character
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImprovedCharacterCreator;
