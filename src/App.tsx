import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LearnMore from "./pages/LearnMore";
import SeeNumbers from "./pages/SeeNumbers";
import DownloadOnePager from "./pages/DownloadOnePager";
import Contact from "./pages/Contact";
import ShareVision from "./pages/ShareVision";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/see-numbers" element={<SeeNumbers />} />
          <Route path="/download-one-pager" element={<DownloadOnePager />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/share-vision" element={<ShareVision />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
