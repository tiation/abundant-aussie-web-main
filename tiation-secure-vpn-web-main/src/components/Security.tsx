
import { Shield, Lock, Eye, Server } from 'lucide-react';

const Security = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: "AES-256 Encryption",
      description: "Military-grade encryption that's virtually unbreakable"
    },
    {
      icon: Lock,
      title: "Kill Switch",
      description: "Automatically cuts internet if VPN connection drops"
    },
    {
      icon: Eye,
      title: "DNS Leak Protection",
      description: "Prevents your real IP from being exposed"
    },
    {
      icon: Server,
      title: "RAM-Only Servers",
      description: "Data is never written to hard drives for maximum security"
    }
  ];

  return (
    <section id="security" className="py-20 bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-neon/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Bank-Level <span className="text-cyan-neon">Security</span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Your privacy and security are our top priorities. We use cutting-edge technology 
            to ensure your data remains completely secure and private.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-cyan-neon/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-cyan-neon/20 transition-colors">
                <feature.icon className="w-10 h-10 text-cyan-neon group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-cyan-neon transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8">Trusted & Verified</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-lg font-semibold">ISO 27001 Certified</div>
            <div className="text-lg font-semibold">SOC 2 Compliant</div>
            <div className="text-lg font-semibold">GDPR Ready</div>
            <div className="text-lg font-semibold">Independently Audited</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;
