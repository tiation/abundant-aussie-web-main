import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href: string;
}

const Breadcrumbs = () => {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];
    
    const pathMap: Record<string, string> = {
      'jobs': 'Find Jobs',
      'profile': 'Profile',
      'qualifications': 'Qualifications',
      'about': 'About Us',
      'contact': 'Contact',
      'privacy': 'Privacy Policy',
      'terms': 'Terms of Service',
      'safety': 'Safety Guidelines'
    };
    
    pathnames.forEach((path, index) => {
      const href = '/' + pathnames.slice(0, index + 1).join('/');
      const label = pathMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
      breadcrumbs.push({ label, href });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  
  if (breadcrumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-4 border-b border-border bg-muted/30">
      <div className="container mx-auto px-4">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
              )}
              {index === 0 ? (
                <Link 
                  to={breadcrumb.href}
                  className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                >
                  <Home className="w-4 h-4 mr-1" />
                  <span>{breadcrumb.label}</span>
                </Link>
              ) : index === breadcrumbs.length - 1 ? (
                <span className="text-foreground font-medium">{breadcrumb.label}</span>
              ) : (
                <Link 
                  to={breadcrumb.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;