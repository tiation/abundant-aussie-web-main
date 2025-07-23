import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: string;
}

const AnimatedCard = ({ children, className, delay = "0s" }: AnimatedCardProps) => {
  return (
    <Card 
      className={cn("card-lift animate-fade-in", className)}
      style={{ animationDelay: delay }}
    >
      {children}
    </Card>
  );
};

export default AnimatedCard;