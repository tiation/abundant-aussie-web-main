
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heart, User } from 'lucide-react';
import { RoleplayMessage } from '@/types/roleplay';

interface RomanticRoleplayCardProps {
  title: string;
  messages: RoleplayMessage[];
}

const RomanticRoleplayCard: React.FC<RomanticRoleplayCardProps> = ({ title, messages }) => {
  return (
    <Card className="bg-rose-100/50 fantasy-shadow">
      <CardHeader className="py-3 px-6 bg-rose-200/50 border-b border-rose-300/20">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-rose-900 text-xl flex items-center gap-2">
            <Heart className="w-5 h-5" />
            {title}
          </h3>
          <span className="text-xs bg-rose-200 text-rose-700 px-2 py-1 rounded-full">18+</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center border border-rose-300">
                <User className="w-4 h-4 text-rose-800" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-rose-900">{message.character}</span>
                  <span className="text-xs text-stone-500">{message.timestamp}</span>
                </div>
                <p className="mt-1 text-stone-800">{message.message}</p>
                {message.emotion && (
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">
                    {message.emotion}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RomanticRoleplayCard;
