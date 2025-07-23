
import React from 'react';
import { Card } from '@/components/ui/card';
import { Heart, Target, Users, Award } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Empathy & Understanding",
      description: "Drawing from lived experience to provide genuine, compassionate support that truly understands your journey."
    },
    {
      icon: Target,
      title: "Goal-Oriented Approach",
      description: "Working collaboratively to set achievable goals and create sustainable pathways to independence and wellbeing."
    },
    {
      icon: Users,
      title: "Community Impact",
      description: "Committed to giving back - 15% of our income goes directly to supporting community mental health initiatives."
    },
    {
      icon: Award,
      title: "Professional Excellence",
      description: "Combining professional qualifications with authentic care to deliver the highest standard of support services."
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About Standing Strong Support Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Founded by Caleb Standing, our mission is to provide comprehensive, empathetic support 
            that empowers individuals to achieve their goals and live independently.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Founder Story */}
          <div className="animate-fade-in-up">
            <Card className="p-8 bg-white border-blue-100 shadow-lg">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">CS</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Caleb Standing</h3>
                <p className="text-blue-600 text-center font-medium">Founder & Director</p>
              </div>
              
              <div className="space-y-4 text-gray-600">
                <p>
                  "My journey into support coordination began with my own lived experience navigating 
                  mental health challenges and the complex systems designed to help us."
                </p>
                <p>
                  "I understand firsthand the importance of having someone who truly gets it - someone 
                  who can walk alongside you with genuine empathy and practical expertise."
                </p>
                <p className="font-medium text-blue-700">
                  "Every day, I'm committed to making a difference - not just for our clients, 
                  but for our broader community through our charitable giving program."
                </p>
              </div>
            </Card>
          </div>

          {/* Mission & Vision */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To provide comprehensive support coordination and psychosocial recovery coaching 
                that empowers individuals to achieve their personal goals, maintain independence, 
                and thrive in their communities.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                A community where every individual has access to compassionate, professional support 
                that honors their unique journey and empowers them to reach their full potential.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Community Commitment</h4>
              <p className="text-blue-700">
                We donate 15% of our income to mental health charities and community organizations, 
                ensuring our success directly contributes to broader community wellbeing.
              </p>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {values.map((value, index) => (
            <Card key={index} className="p-6 text-center bg-white border-blue-100 hover:shadow-lg transition-all-smooth">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
