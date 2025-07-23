
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import Email from "./pages/Email";
import GitLabPage from "./pages/GitLabPage";
import JupyterHub from "./pages/JupyterHub";
import AIAssistant from "./pages/AIAssistant";
import TheiaProjects from "./pages/TheiaProjects";
import VersionControlPage from "./pages/VersionControl";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<TheiaProjects />} />
            <Route path="/version-control" element={<VersionControlPage />} />
            <Route path="/ide" element={<Dashboard />} />
            <Route path="/settings" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/email" element={<Email />} />
            <Route path="/gitlab" element={<GitLabPage />} />
            <Route path="/jupyter" element={<JupyterHub />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
