import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Qualifications from "./pages/Qualifications";
import FindTraining from "./pages/FindTraining";
import SetReminders from "./pages/SetReminders";
import Auth from "./pages/Auth";
import HelpCentre from "./pages/HelpCentre";
import ContactSupport from "./pages/ContactSupport";
import Compliance from "./pages/Compliance";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Safety from "./pages/Safety";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/qualifications" element={<Qualifications />} />
              <Route path="/find-training" element={<FindTraining />} />
              <Route path="/set-reminders" element={<SetReminders />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/help-centre" element={<HelpCentre />} />
              <Route path="/contact-support" element={<ContactSupport />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/safety" element={<Safety />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
