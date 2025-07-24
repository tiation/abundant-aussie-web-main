import React, { useState } from 'react';
import Button from '../UI/Button';

interface NavigationProps {
  brand?: string;
  menuItems?: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
    active?: boolean;
  }>;
  onMenuItemClick?: (href: string) => void;
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  brand = 'PosCalls4U',
  menuItems = [],
  onMenuItemClick,
  className = '',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuItemClick = (href: string) => {
    onMenuItemClick?.(href);
    setIsMobileMenuOpen(false); // Close mobile menu on item click
  };

  return (
    <nav 
      className={`bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-40 ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand/Logo */}
          <div className="flex items-center">
            <button
              className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-2 py-1"
              onClick={() => handleMenuItemClick('/')}
              aria-label={`Go to ${brand} homepage`}
            >
              {brand}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuItemClick(item.href)}
                className={`
                  flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  transform hover:scale-105 active:scale-95
                  ${
                    item.active
                      ? 'nav-link-active bg-primary-100 text-primary-700'
                      : 'nav-link text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }
                `.trim().replace(/\s+/g, ' ')}
                aria-current={item.active ? 'page' : undefined}
              >
                {item.icon && (
                  <span className="mr-2 flex-shrink-0" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
              className="p-2"
            >
              <svg
                className={`h-5 w-5 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`
          md:hidden transition-all duration-300 ease-in-out overflow-hidden
          ${
            isMobileMenuOpen
              ? 'max-h-96 opacity-100 animate-slide-in-down'
              : 'max-h-0 opacity-0'
          }
        `.trim().replace(/\s+/g, ' ')}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="px-4 py-2 space-y-1 bg-neutral-50 border-t border-neutral-200">
          {menuItems.map((item, index) => (
            <button
              key={`mobile-${index}`}
              onClick={() => handleMenuItemClick(item.href)}
              className={`
                flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                transform hover:scale-[1.02] active:scale-98
                ${
                  item.active
                    ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-500'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-white'
                }
              `.trim().replace(/\s+/g, ' ')}
              aria-current={item.active ? 'page' : undefined}
            >
              {item.icon && (
                <span className="mr-3 flex-shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
