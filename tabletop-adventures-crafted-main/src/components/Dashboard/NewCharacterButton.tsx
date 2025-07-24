
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

const NewCharacterButton: React.FC = () => {
  return (
    <Link to="/characters/new">
      <Card className="parchment h-full border-dashed border-2 border-amber-800/30 hover:border-amber-800/50 hover:-translate-y-1 transition-all duration-200 cursor-pointer">
        <CardContent className="flex flex-col items-center justify-center h-full p-6">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-amber-900" />
          </div>
          <h3 className="text-xl font-serif font-bold text-amber-900">Create New Character</h3>
          <p className="text-sm text-stone-600 mt-2 text-center">
            Start a new adventure with a fresh character sheet
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NewCharacterButton;
