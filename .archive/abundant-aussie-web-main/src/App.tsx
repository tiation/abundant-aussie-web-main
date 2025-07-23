import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, ErrorBoundary } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LearnMore = lazy(() => import("./pages/LearnMore"));
const SeeNumbers = lazy(() => import("./pages/SeeNumbers"));
const DownloadOnePager = lazy(() => import("./pages/DownloadOnePager"));
const Contact = lazy(() => import("./pages/Contact"));
const ShareVision = lazy(() => import("./pages/ShareVision"));

// Enhanced QueryClient with enterprise configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 2,
    },
  },
});

// Loading component for Suspense fallbacks
const LoadingSpinner = () => (
  <div 
    className="flex items-center justify-center min-h-screen"
    role="status"
    aria-label="Loading application"
  >
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

// Error Boundary Component
class AppErrorBoundary extends ErrorBoundary {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Application Error:', error, errorInfo);
    // In a real app, you'd send this to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We apologize for the inconvenience. The application encountered an unexpected error.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Reload Application
                </button>
                <a
                  href="https://github.com/tiation/abundant-aussie-web-main/issues"
                  className="block w-full text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Report Issue
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  return (
    <HelmetProvider>
      <AppErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Helmet>
              <html lang="en-AU" />
              <body className="font-sans antialiased" />
            </Helmet>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/learn-more" element={<LearnMore />} />
                  <Route path="/see-numbers" element={<SeeNumbers />} />
                  <Route path="/download-one-pager" element={<DownloadOnePager />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/share-vision" element={<ShareVision />} />
                  {/* Health check endpoint for monitoring */}
                  <Route path="/health" element={<div>OK</div>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AppErrorBoundary>
    </HelmetProvider>
  );
};

export default App;
