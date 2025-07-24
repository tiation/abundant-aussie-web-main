
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const Pricing = () => {
  const plans = [
    {
      name: "Monthly",
      price: "$12.99",
      period: "/month",
      description: "Perfect for trying out our service",
      features: [
        "Unlimited bandwidth",
        "75+ server locations",
        "5 simultaneous connections",
        "24/7 customer support",
        "30-day money-back guarantee"
      ],
      popular: false
    },
    {
      name: "Annual",
      price: "$4.99",
      period: "/month",
      originalPrice: "$12.99",
      description: "Best value for long-term protection",
      features: [
        "Everything in Monthly",
        "Priority server access",
        "Advanced malware protection",
        "Dedicated IP option",
        "Premium 24/7 support"
      ],
      popular: true,
      savings: "Save 62%"
    },
    {
      name: "2-Year",
      price: "$2.99",
      period: "/month",
      originalPrice: "$12.99",
      description: "Maximum savings for ultimate security",
      features: [
        "Everything in Annual",
        "10 simultaneous connections",
        "Cloud storage (1TB)",
        "Password manager included",
        "VIP support channel"
      ],
      popular: false,
      savings: "Save 77%"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-cyan-50/30 via-white to-cyan-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, <span className="text-cyan-neon">Transparent</span> Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. All plans include our full feature set with 30-day money-back guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                plan.popular 
                  ? 'border-2 border-cyan-neon bg-gradient-to-br from-white to-cyan-50/50 scale-105' 
                  : 'border border-gray-200 hover:border-cyan-neon/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-cyan-neon text-black text-center py-2 font-semibold">
                  <Star className="inline w-4 h-4 mr-1" />
                  Most Popular
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-8'}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                {plan.savings && (
                  <div className="inline-block bg-red-500 text-white text-sm px-3 py-1 rounded-full mb-4">
                    {plan.savings}
                  </div>
                )}
                <div className="mb-4">
                  <span className="text-5xl font-bold text-cyan-neon">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                  {plan.originalPrice && (
                    <div className="text-gray-400 line-through text-lg mt-1">
                      {plan.originalPrice}/month
                    </div>
                  )}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <Button 
                  className={`w-full mb-8 ${
                    plan.popular 
                      ? 'bg-cyan-neon hover:bg-cyan-600 text-black font-semibold animate-glow' 
                      : 'bg-gray-900 hover:bg-cyan-neon hover:text-black'
                  }`}
                  size="lg"
                >
                  Get Started
                </Button>

                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-cyan-neon mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include 30-day money-back guarantee • No setup fees • Cancel anytime
          </p>
          <Button variant="outline" className="border-cyan-neon text-cyan-neon hover:bg-cyan-neon hover:text-black">
            Compare All Features
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
