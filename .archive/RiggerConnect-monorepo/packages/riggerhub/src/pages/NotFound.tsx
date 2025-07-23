import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist. It may have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary-hover transition-colors font-medium"
          >
            Return to Home
          </Link>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <Link to="/jobs" className="text-primary hover:underline">Find Jobs</Link>
            <Link to="/profile" className="text-primary hover:underline">Your Profile</Link>
            <Link to="/contact" className="text-primary hover:underline">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
