
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/LoginForm";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary p-4">
        <div className="container mx-auto">
          <div className="flex items-center">
            <h1 className="text-white text-xl font-bold">Tiation</h1>
            <span className="text-white/80 text-sm ml-2">Board Development Portal</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-background to-secondary/30">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Tiation Board Portal</h2>
              <p className="text-muted-foreground mt-2">
                Access your NGO's development projects, version control, and integrated IDE in one place.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                    <path d="m18 15-6-6-6 6"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Project Management</h3>
                  <p className="text-sm text-muted-foreground">Track and manage development projects</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Version Control</h3>
                  <p className="text-sm text-muted-foreground">Integrated GitLab version control</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                    <path d="m16 18 2-2-2-2"/>
                    <path d="m8 18-2-2 2-2"/>
                    <path d="M10 18h4"/>
                    <path d="m3 7 3 3 3-3"/>
                    <path d="m15 7 3 3 3-3"/>
                    <path d="M7.5 4v3"/>
                    <path d="M16.5 4v3"/>
                    <path d="M7.5 20v-3"/>
                    <path d="M16.5 20v-3"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Integrated Development</h3>
                  <p className="text-sm text-muted-foreground">Built-in Theia IDE for coding</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <LoginForm />
          </div>
        </div>
      </main>
      
      <footer className="bg-muted py-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Tiation NGO. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
