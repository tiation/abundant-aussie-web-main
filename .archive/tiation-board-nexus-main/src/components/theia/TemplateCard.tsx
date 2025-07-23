
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitFork } from "lucide-react";

export interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    language: string;
  };
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card key={template.id}>
      <CardHeader className="pb-3">
        <div className="space-y-1">
          <CardTitle>{template.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{template.description}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4 text-sm">
          <span className="inline-block h-3 w-3 rounded-full bg-primary mr-2" />
          <span>{template.language}</span>
        </div>
        <Button className="w-full">
          <GitFork className="mr-2 h-4 w-4" />
          Use Template
        </Button>
      </CardContent>
    </Card>
  );
}
