
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MessageSquare, User } from 'lucide-react';

interface RoleplayMessage {
  id: string;
  character: string;
  message: string;
  timestamp: string;
}

interface RoleplayCardProps {
  title: string;
  messages: RoleplayMessage[];
}

const RoleplayCard: React.FC<RoleplayCardProps> = ({ title, messages }) => {
  return (
    <Card className="parchment fantasy-shadow">
      <CardHeader className="py-3 px-6 bg-amber-100/50 border-b border-amber-800/10">
        <h3 className="font-serif font-bold text-amber-900 text-xl">{title}</h3>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center border border-amber-800/20">
                <User className="w-4 h-4 text-amber-900" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-amber-900">{message.character}</span>
                  <span className="text-xs text-stone-500">{message.timestamp}</span>
                </div>
                <p className="mt-1 text-stone-700">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleplayCard;
