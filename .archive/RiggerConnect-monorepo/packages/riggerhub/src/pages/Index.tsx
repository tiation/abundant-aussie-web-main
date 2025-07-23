import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <Header />
      <main id="main-content">
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
