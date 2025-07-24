
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CharacterSheet from '@/components/Character/CharacterSheet';
import { dummyCharacters } from '@/data/dummyData';

const CharacterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const character = dummyCharacters.find(char => char.id === id);
  
  if (!character) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-serif font-bold text-amber-900 mb-4">Character not found</h2>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Characters
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-serif font-bold text-amber-900">Character Sheet</h1>
      </div>
      
      <CharacterSheet character={character} />
    </div>
  );
};

export default CharacterDetail;
