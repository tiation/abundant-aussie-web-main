
import { Shield, Zap, Globe, Lock, Eye, Smartphone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Military-Grade Encryption",
      description: "AES-256 encryption protects your data with the same security standards used by governments and military organizations worldwide."
    },
    {
      icon: Zap,
      title: "Lightning Fast Speeds",
      description: "Our optimized servers ensure you enjoy blazing-fast internet speeds without compromising on security or privacy."
    },
    {
      icon: Globe,
      title: "Global Server Network",
      description: "Access content from anywhere with our 75+ high-speed servers strategically located across 50+ countries."
    },
    {
      icon: Lock,
      title: "Zero-Logs Policy",
      description: "We don't track, collect, or share your personal data. Your online activity remains completely private and anonymous."
    },
    {
      icon: Eye,
      title: "No-Spy Protection",
      description: "Shield yourself from ISPs, governments, and hackers. Browse the internet with complete anonymity and peace of mind."
    },
    {
      icon: Smartphone,
      title: "Multi-Device Support",
      description: "Protect all your devices with one account. Compatible with Windows, Mac, iOS, Android, and router installations."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-cyan-neon">Gadtia VPN</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the perfect blend of security, speed, and simplicity with our premium VPN service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-cyan-50/30 hover:from-cyan-50/50 hover:to-cyan-100/50"
            >
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-cyan-neon/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-neon/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-cyan-neon group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-cyan-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
