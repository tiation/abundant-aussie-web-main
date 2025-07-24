
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you for your interest!",
      description: "We'll keep you updated on the $19 Trillion Solution.",
    });
    setEmail('');
  };

  return (
    <div className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Movement</h2>
          <p className="text-xl mb-8">
            Help us transform Australia through the $19 Trillion Solution. Stay updated on our progress and learn how you can get involved.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold">
              Subscribe
            </Button>
          </form>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline-light">
              <Link to="/download-one-pager">Download One-Pager</Link>
            </Button>
            <Button asChild variant="outline-light">
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline-light">
              <Link to="/share-vision">Share The Vision</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
