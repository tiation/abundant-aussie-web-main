
import { TemplateCard } from "./TemplateCard";

const templates = [
  { id: "t1", name: "React Web App", description: "Basic React web application template", language: "TypeScript" },
  { id: "t2", name: "REST API Service", description: "REST API service with Express", language: "JavaScript" },
  { id: "t3", name: "Full-Stack Application", description: "React frontend with Express backend", language: "TypeScript" },
];

export function TemplatesTabContent() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
