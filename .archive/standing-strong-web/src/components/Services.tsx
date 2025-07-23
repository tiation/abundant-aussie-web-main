
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Compass, Brain, FileText, Users, CheckCircle, ArrowRight } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Compass,
      title: "Support Coordination",
      description: "Navigate the NDIS and connect with the right services and supports for your unique needs and goals.",
      features: [
        "NDIS plan implementation",
        "Service provider coordination", 
        "Goal setting and monitoring",
        "Crisis support planning"
      ],
      accent: "from-blue-500 to-blue-600"
    },
    {
      icon: Brain,
      title: "Psychosocial Recovery Coaching",
      description: "Develop skills and strategies to manage mental health challenges and work towards your recovery goals.",
      features: [
        "Recovery-oriented planning",
        "Skill development sessions",
        "Peer support connection",
        "Community integration"
      ],
      accent: "from-blue-600 to-blue-700"
    },
    {
      icon: FileText,
      title: "NDIS Navigation Support",
      description: "Get expert help understanding and maximizing your NDIS plan, from application to review.",
      features: [
        "Plan review preparation",
        "Evidence gathering",
        "Provider selection guidance",
        "Appeals and reviews"
      ],
      accent: "from-blue-400 to-blue-500"
    }
  ];

  const process = [
    {
      step: "1",
      title: "Initial Consultation",
      description: "We start with a comprehensive assessment to understand your needs, goals, and current situation."
    },
    {
      step: "2", 
      title: "Personalized Planning",
      description: "Together, we develop a tailored support plan that aligns with your goals and NDIS funding."
    },
    {
      step: "3",
      title: "Implementation & Support", 
      description: "We coordinate services, provide coaching, and offer ongoing support as you work toward your goals."
    },
    {
      step: "4",
      title: "Review & Adjust",
      description: "Regular reviews ensure your support remains effective and adapts to your changing needs."
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Professional Support Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive, person-centered services designed to support your journey 
            toward independence and wellbeing.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <Card key={index} className="p-8 bg-white border-blue-100 hover:shadow-xl transition-all-smooth animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`w-16 h-16 bg-gradient-to-r ${service.accent} rounded-full flex items-center justify-center mb-6`}>
                <service.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              
              <div className="space-y-3 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                Learn More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
        </div>

        {/* Process Section */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12 animate-fade-in-up">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Support Process</h3>
            <p className="text-xl text-gray-600">
              A structured, collaborative approach designed around your unique needs and goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">{step.step}</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl mb-8 opacity-90">
              Take the first step toward achieving your goals with personalized support
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3">
                Schedule Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3">
                Call (08) 1234 5678
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
