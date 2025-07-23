import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Twitter, Facebook, Linkedin, Link as LinkIcon, Copy, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ShareVision = () => {
  const { toast } = useToast();
  
  const shareUrl = "https://19trillion.com.au";
  const shareText = "Australia's $19 Trillion Solution: Transform our nation by unlocking existing wealth to eliminate poverty, crime, and scarcity. Learn more at";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    toast({
      title: "Copied to clipboard!",
      description: "Share text has been copied successfully.",
    });
  };

  const shareOnPlatform = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    let url = "";
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Share The Vision</h1>
            <p className="text-xl text-muted-foreground">
              Help spread awareness about The $19 Trillion Solution and build momentum for transformative change.
            </p>
          </div>

          <div className="bg-muted/30 border rounded-lg p-8 mb-8">
            <h3 className="text-lg font-semibold mb-4">Share Message</h3>
            <div className="bg-background border rounded p-4 mb-4">
              <p className="text-sm">
                {shareText} {shareUrl}
              </p>
            </div>
            <Button onClick={copyToClipboard} variant="outline" className="gap-2">
              <Copy className="w-4 h-4" />
              Copy to Clipboard
            </Button>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Social Media Platforms</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <Button 
                  onClick={() => shareOnPlatform('twitter')}
                  className="gap-2 h-12"
                  variant="outline"
                >
                  <Twitter className="w-5 h-5" />
                  Share on Twitter
                </Button>
                
                <Button 
                  onClick={() => shareOnPlatform('facebook')}
                  className="gap-2 h-12"
                  variant="outline"
                >
                  <Facebook className="w-5 h-5" />
                  Share on Facebook
                </Button>
                
                <Button 
                  onClick={() => shareOnPlatform('linkedin')}
                  className="gap-2 h-12"
                  variant="outline"
                >
                  <Linkedin className="w-5 h-5" />
                  Share on LinkedIn
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Suggested Hashtags</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  '#19TrillionSolution',
                  '#AustraliaTransformed',
                  '#UBIAustralia',
                  '#EndPoverty',
                  '#WealthUnlock',
                  '#EconomicJustice',
                  '#SocialChange',
                  '#AustralianFuture'
                ].map(tag => (
                  <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Share With Your Network</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Email Your Contacts</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Forward this message to friends, family, and colleagues who care about Australia's future.
                  </p>
                  <Button variant="outline" size="sm">
                    Open Email Template
                  </Button>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Community Groups</h4>
                  <p className="text-sm text-muted-foreground">
                    Share in local community groups, professional networks, and advocacy organizations.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Media & Influencers</h4>
                  <p className="text-sm text-muted-foreground">
                    Reach out to journalists, podcasters, and thought leaders who cover economic policy.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Share2 className="w-6 h-6 text-primary mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Why Sharing Matters</h3>
                  <p className="text-muted-foreground">
                    Real change happens when ideas reach a critical mass. Every share helps build 
                    awareness and creates pressure for policy makers to consider transformative solutions. 
                    Your voice can help make The $19 Trillion Solution a reality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareVision;