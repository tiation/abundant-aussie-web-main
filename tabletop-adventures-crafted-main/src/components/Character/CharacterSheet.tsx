
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Character, getModifier, formatModifier } from '@/utils/dndTypes';
import { Separator } from '@/components/ui/separator';

interface CharacterSheetProps {
  character: Character;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character }) => {
  return (
    <div className="parchment p-6 rounded-lg">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3">
          <div className="text-center mb-6">
            <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full border-4 border-amber-800/20">
              <img 
                src={character.avatarUrl || `https://placehold.co/400x400/9f8970/FFFFFF?text=${character.name.charAt(0)}&font=serif`}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-serif font-bold text-amber-900">{character.name}</h1>
            <p className="text-stone-600">
              Level {character.level} {character.race} {character.class}
            </p>
            <p className="text-stone-500 text-sm mt-1">{character.background} • {character.alignment}</p>
          </div>
          
          <Card className="mb-6">
            <CardHeader className="py-2 px-4 bg-amber-100/50 border-b border-amber-800/10">
              <h3 className="font-serif font-bold text-amber-900">Core Stats</h3>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3 p-4">
              {Object.entries(character.attributes).map(([attr, value]) => (
                <div key={attr} className="stat-box">
                  <div className="text-xs text-amber-800 uppercase font-semibold">
                    {attr.substring(0, 3)}
                  </div>
                  <div className="font-bold text-lg">{value}</div>
                  <div className="text-sm">{formatModifier(getModifier(value))}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader className="py-2 px-4 bg-amber-100/50 border-b border-amber-800/10">
              <h3 className="font-serif font-bold text-amber-900">Combat Stats</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="stat-box">
                  <div className="text-xs text-amber-800 font-semibold">HP</div>
                  <div className="font-bold">{character.hitPoints.current}/{character.hitPoints.maximum}</div>
                </div>
                <div className="stat-box">
                  <div className="text-xs text-amber-800 font-semibold">AC</div>
                  <div className="font-bold">{character.armorClass}</div>
                </div>
                <div className="stat-box">
                  <div className="text-xs text-amber-800 font-semibold">INIT</div>
                  <div className="font-bold">{formatModifier(character.initiative)}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="stat-box">
                  <div className="text-xs text-amber-800 font-semibold">PROF</div>
                  <div className="font-bold">{formatModifier(character.proficiencyBonus)}</div>
                </div>
                <div className="stat-box">
                  <div className="text-xs text-amber-800 font-semibold">SPEED</div>
                  <div className="font-bold">{character.speed}</div>
                </div>
                <div className="stat-box">
                  <div className="text-xs text-amber-800 font-semibold">HIT DICE</div>
                  <div className="font-bold">{character.hitDice.total}{character.hitDice.type}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:w-2/3">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="parchment w-full mb-4">
              <TabsTrigger value="features" className="flex-1 font-serif">Features</TabsTrigger>
              <TabsTrigger value="inventory" className="flex-1 font-serif">Inventory</TabsTrigger>
              {character.spells && <TabsTrigger value="spells" className="flex-1 font-serif">Spells</TabsTrigger>}
              <TabsTrigger value="skills" className="flex-1 font-serif">Skills</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="space-y-4">
              {character.features.map(feature => (
                <Card key={feature.id} className="parchment overflow-hidden">
                  <CardHeader className="py-2 px-4 bg-amber-100/50 border-b border-amber-800/10">
                    <div className="flex justify-between">
                      <h3 className="font-serif font-bold text-amber-900">{feature.name}</h3>
                      <span className="text-sm text-stone-600">{feature.source}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-stone-700">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-4">
              <Card className="parchment">
                <CardHeader className="py-2 px-4 bg-amber-100/50 border-b border-amber-800/10">
                  <h3 className="font-serif font-bold text-amber-900">Equipment</h3>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-amber-800/10">
                    {character.inventory.map(item => (
                      <div key={item.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-amber-900">{item.name}</h4>
                            <p className="text-sm text-stone-600">{item.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {item.equipped && <span className="text-green-600">Equipped</span>}
                            </div>
                            <div className="text-xs text-stone-500 mt-1">
                              Qty: {item.quantity} • Weight: {item.weight} lb • {item.value} gp
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {character.spells && (
              <TabsContent value="spells" className="space-y-4">
                <Card className="parchment">
                  <CardHeader className="py-2 px-4 bg-amber-100/50 border-b border-amber-800/10">
                    <h3 className="font-serif font-bold text-amber-900">Prepared Spells</h3>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-amber-800/10">
                      {character.spells
                        .filter(spell => spell.prepared)
                        .sort((a, b) => a.level - b.level)
                        .map(spell => (
                        <div key={spell.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-amber-900">{spell.name}</h4>
                              <p className="text-xs text-stone-500">
                                Level {spell.level} {spell.school} • {spell.castingTime} • {spell.range}
                              </p>
                              <p className="text-sm mt-1 text-stone-700">{spell.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-stone-500">
                                Components: {spell.components.join(", ")}
                              </div>
                              <div className="text-xs text-stone-500">
                                Duration: {spell.duration}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            <TabsContent value="skills" className="space-y-4">
              <Card className="parchment">
                <CardHeader className="py-2 px-4 bg-amber-100/50 border-b border-amber-800/10">
                  <h3 className="font-serif font-bold text-amber-900">Skills & Proficiencies</h3>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-amber-900 mb-2">Saving Throws</h4>
                      <ul className="space-y-1 text-sm">
                        {character.savingThrows.map(save => (
                          <li key={save} className="text-green-700">✓ {save}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-900 mb-2">Skills</h4>
                      <ul className="space-y-1 text-sm">
                        {character.skills.map(skill => (
                          <li key={skill} className="text-green-700">✓ {skill}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;
