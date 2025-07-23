
import React from 'react';
import { 
  TrendingUp, 
  Home, 
  Heart, 
  Shield, 
  BookOpen, 
  Users 
} from 'lucide-react';

const BenefitCard = ({ icon, title, description }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start">
        <div className="mr-4 text-blue-600">{icon}</div>
        <div>
          <h3 className="text-lg font-bold mb-2 text-blue-800">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

const Benefits = () => {
  const benefits = [
    {
      icon: <TrendingUp size={24} />,
      title: "Economic Transformation",
      description: "Immediate release of purchasing power creates an economic boom with sustainable long-term growth."
    },
    {
      icon: <Home size={24} />,
      title: "Universal Housing Security",
      description: "Everyone gets access to housing credits, eliminating homelessness and housing stress."
    },
    {
      icon: <Heart size={24} />,
      title: "Health Improvement",
      description: "Poverty-related health issues vanish as everyone can afford proper nutrition and preventive care."
    },
    {
      icon: <Shield size={24} />,
      title: "Crime Reduction",
      description: "Economic crimes plummet when scarcity is eliminated and communities are strengthened."
    },
    {
      icon: <BookOpen size={24} />,
      title: "Educational Opportunity",
      description: "Everyone can pursue education and skills development without financial barriers."
    },
    {
      icon: <Users size={24} />,
      title: "Community Revitalization",
      description: "Mandatory connection infrastructure builds stronger communities and social cohesion."
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">Benefits</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            The transformative impacts of the $19 Trillion Solution
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard 
              key={index} 
              icon={benefit.icon} 
              title={benefit.title} 
              description={benefit.description} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Benefits;
