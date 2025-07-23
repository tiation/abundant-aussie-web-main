
import React from 'react';
import Hero from '@/components/Hero';
import Overview from '@/components/Overview';
import Mechanism from '@/components/Mechanism';
import Benefits from '@/components/Benefits';
import FAQ from '@/components/FAQ';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Overview />
      <Mechanism />
      <Benefits />
      <FAQ />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
