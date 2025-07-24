
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Sparkles, User, Flame } from 'lucide-react';
import { RoleplayMessage } from '@/types/roleplay';

interface FantasyRoleplayCardProps {
  title: string;
  messages: RoleplayMessage[];
}

const FantasyRoleplayCard: React.FC<FantasyRoleplayCardProps> = ({ title, messages }) => {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 fantasy-shadow">
      <CardHeader className="py-3 px-6 bg-gradient-to-r from-purple-200/40 to-indigo-200/40 border-b border-purple-300/20">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-purple-900 text-xl flex items-center gap-2">
            <Flame className="w-5 h-5" />
            {title}
          </h3>
          <span className="text-xs bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-2 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> 18+ Fantasy
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                message.fantasyRating && message.fantasyRating > 3 
                ? "bg-gradient-to-br from-purple-200 to-indigo-200 border-purple-400"
                : "bg-purple-100 border-purple-300"
              }`}>
                <User className="w-4 h-4 text-purple-800" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-purple-900">{message.character}</span>
                  <span className="text-xs text-stone-500">{message.timestamp}</span>
                  {message.fantasyRating && (
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      message.fantasyRating > 3 
                        ? "bg-gradient-to-r from-purple-200 to-indigo-200 text-purple-800" 
                        : "bg-purple-100 text-purple-700"
                    }`}>
                      <Flame className="w-3 h-3" />
                      {message.fantasyRating}/5
                    </span>
                  )}
                </div>
                <p className={`mt-1 ${
                  message.fantasyRating && message.fantasyRating > 3 
                  ? "text-purple-900 font-medium" 
                  : "text-stone-800"
                }`}>{message.message}</p>
                {message.emotion && (
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
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

export default FantasyRoleplayCard;
