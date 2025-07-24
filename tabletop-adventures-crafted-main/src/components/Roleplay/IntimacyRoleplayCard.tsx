
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { HeartHandshake, User, Sparkles } from 'lucide-react';
import { RoleplayMessage } from '@/types/roleplay';

interface IntimacyRoleplayCardProps {
  title: string;
  messages: RoleplayMessage[];
}

const IntimacyRoleplayCard: React.FC<IntimacyRoleplayCardProps> = ({ title, messages }) => {
  return (
    <Card className="bg-gradient-to-br from-rose-50 to-purple-50 fantasy-shadow">
      <CardHeader className="py-3 px-6 bg-gradient-to-r from-rose-200/40 to-purple-200/40 border-b border-rose-300/20">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-rose-900 text-xl flex items-center gap-2">
            <HeartHandshake className="w-5 h-5" />
            {title}
          </h3>
          <span className="text-xs bg-gradient-to-r from-rose-100 to-purple-100 text-rose-800 px-2 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Deep Connection
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                message.connectionStrength && message.connectionStrength > 7 
                ? "bg-gradient-to-br from-rose-200 to-purple-200 border-rose-400"
                : "bg-rose-100 border-rose-300"
              }`}>
                <User className="w-4 h-4 text-rose-800" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-rose-900">{message.character}</span>
                  <span className="text-xs text-stone-500">{message.timestamp}</span>
                  {message.connectionStrength && (
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      message.connectionStrength > 7 
                        ? "bg-gradient-to-r from-rose-200 to-purple-200 text-rose-800" 
                        : "bg-rose-100 text-rose-700"
                    }`}>
                      <HeartHandshake className="w-3 h-3" />
                      {message.connectionStrength}/10
                    </span>
                  )}
                </div>
                <p className={`mt-1 ${
                  message.connectionStrength && message.connectionStrength > 7 
                  ? "text-rose-900 font-medium" 
                  : "text-stone-800"
                }`}>{message.message}</p>
                {message.emotion && (
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
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

export default IntimacyRoleplayCard;
