
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Character, getModifier, formatModifier } from '@/utils/dndTypes';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <Link to={`/characters/${character.id}`}>
      <Card className="parchment fantasy-shadow h-full overflow-hidden hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
        <div className="h-40 overflow-hidden">
          <img 
            src={character.avatarUrl || `https://placehold.co/400x300/9f8970/FFFFFF?text=${character.name}&font=serif`} 
            alt={character.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-xl font-serif font-bold text-amber-900">{character.name}</h3>
          <div className="flex justify-between items-center mt-1 text-sm text-stone-700">
            <span>{character.race}</span>
            <span>Level {character.level} {character.class}</span>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="stat-box">
              <div className="text-xs text-amber-800 uppercase font-semibold">STR</div>
              <div className="font-bold">{formatModifier(getModifier(character.attributes.strength))}</div>
            </div>
            <div className="stat-box">
              <div className="text-xs text-amber-800 uppercase font-semibold">DEX</div>
              <div className="font-bold">{formatModifier(getModifier(character.attributes.dexterity))}</div>
            </div>
            <div className="stat-box">
              <div className="text-xs text-amber-800 uppercase font-semibold">CON</div>
              <div className="font-bold">{formatModifier(getModifier(character.attributes.constitution))}</div>
            </div>
          </div>
          
          <div className="mt-3 text-xs flex justify-between items-center text-stone-600">
            <div>HP: {character.hitPoints.current}/{character.hitPoints.maximum}</div>
            <div>AC: {character.armorClass}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CharacterCard;
