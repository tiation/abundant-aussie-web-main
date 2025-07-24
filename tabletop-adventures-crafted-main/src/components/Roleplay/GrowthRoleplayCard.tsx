
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Sparkles, User, Rocket } from 'lucide-react';
import { RoleplayMessage } from '@/types/roleplay';

interface GrowthRoleplayCardProps {
  title: string;
  messages: RoleplayMessage[];
}

const GrowthRoleplayCard: React.FC<GrowthRoleplayCardProps> = ({ title, messages }) => {
  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 fantasy-shadow">
      <CardHeader className="py-3 px-6 bg-gradient-to-r from-emerald-200/40 to-teal-200/40 border-b border-emerald-300/20">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-emerald-900 text-xl flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            {title}
          </h3>
          <span className="text-xs bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-2 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Personal Journey
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                message.growthProgress && message.growthProgress > 70 
                ? "bg-gradient-to-br from-emerald-200 to-teal-200 border-emerald-400"
                : "bg-emerald-100 border-emerald-300"
              }`}>
                <User className="w-4 h-4 text-emerald-800" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-emerald-900">{message.character}</span>
                  <span className="text-xs text-stone-500">{message.timestamp}</span>
                  {message.growthProgress && (
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500" 
                          style={{ width: `${message.growthProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-emerald-800">{message.growthProgress}%</span>
                    </div>
                  )}
                </div>
                <p className={`mt-1 ${
                  message.growthProgress && message.growthProgress > 70 
                  ? "text-emerald-900 font-medium" 
                  : "text-stone-800"
                }`}>{message.message}</p>
                {message.emotion && (
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
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

export default GrowthRoleplayCard;
