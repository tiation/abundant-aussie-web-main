# Customization Guide

This guide will help you customize the Tiation React Template for your specific project needs.

## 🚀 Getting Started

### 1. Basic Setup

After creating a new repository from this template:

```bash
# Clone your new repository
git clone https://github.com/your-username/your-project-name.git
cd your-project-name

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Project Configuration

Update the following files to match your project:

#### package.json
```json
{
  "name": "your-project-name",
  "description": "Your project description",
  "homepage": "https://your-username.github.io/your-project-name",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/your-project-name.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/your-project-name/issues"
  },
  "keywords": [
    "your",
    "project",
    "keywords"
  ]
}
```

#### vite.config.ts
```typescript
export default defineConfig(({ mode }) => ({
  // ... other config
  base: '/your-project-name/',
  // ... rest of config
}));
```

#### index.html
```html
<title>Your Project Name</title>
<meta name="description" content="Your project description" />
<meta name="keywords" content="your,project,keywords" />
```

## 🎨 Theming & Styling

### Color Scheme

The template uses a dark neon theme with cyan/magenta gradients. You can customize colors in:

#### Tailwind CSS (tailwind.config.ts)
```typescript
export default {
  theme: {
    extend: {
      colors: {
        // Customize your brand colors
        primary: {
          DEFAULT: '#00FFFF', // Cyan
          foreground: '#000000'
        },
        secondary: {
          DEFAULT: '#FF00FF', // Magenta
          foreground: '#FFFFFF'
        },
        // Add your custom colors
        brand: {
          primary: '#YourColor',
          secondary: '#YourSecondaryColor'
        }
      }
    }
  }
}
```

#### CSS Variables (src/index.css)
```css
:root {
  --primary: 180 100% 50%; /* Cyan */
  --secondary: 300 100% 50%; /* Magenta */
  --background: 0 0% 4%; /* Dark background */
  --foreground: 0 0% 100%; /* White text */
  
  /* Customize your variables */
  --your-custom-color: 210 100% 50%;
}
```

### Typography

The template uses Inter and Playfair Display fonts. You can customize in:

#### index.html
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

#### tailwind.config.ts
```typescript
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['YourFont', 'Inter', 'sans-serif'],
        display: ['YourDisplayFont', 'Playfair Display', 'serif']
      }
    }
  }
}
```

## 🧩 Components

### Header Component

Customize the header in `src/components/Header.tsx`:

```typescript
// Update branding
<h1 className="text-2xl font-playfair font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
  Your Brand
</h1>
<p className="text-xs text-muted-foreground">Your Tagline</p>

// Update navigation items
const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'Features', href: '#features' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

// Update CTA button
<Button onClick={handleCTA}>
  Your CTA Text
</Button>
```

### Hero Section

Customize the hero section in `src/components/HeroSection.tsx`:

```typescript
// Update hero content
<h1 className="text-4xl sm:text-5xl lg:text-7xl font-playfair font-bold leading-tight">
  Your{' '}
  <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
    Hero
  </span>
  {' '}Title
</h1>
<p className="mobile-text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
  Your compelling description that explains what your project does
  and why users should care about it.
</p>

// Update buttons
<Button size="lg" onClick={handleGetStarted}>
  Get Started
</Button>
<Button variant="outline" size="lg" onClick={handleLearnMore}>
  Learn More
</Button>

// Update stats
<div className="text-center">
  <div className="text-2xl lg:text-3xl font-playfair font-bold text-primary">1000+</div>
  <div className="text-xs lg:text-sm text-muted-foreground">Your Metric</div>
</div>
```

### Floating Cards

Customize the floating cards with your own content:

```typescript
// Replace wellness-focused cards with your content
<div className="bg-card rounded-2xl p-4 lg:p-6 shadow-lg animate-float border border-border">
  <div className="flex items-center space-x-3 lg:space-x-4">
    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-light rounded-full flex items-center justify-center">
      <YourIcon className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
    </div>
    <div>
      <h3 className="font-semibold text-sm lg:text-base">Your Feature</h3>
      <p className="text-xs lg:text-sm text-muted-foreground">Feature description</p>
    </div>
  </div>
</div>
```

## 📱 Sections

### Adding New Sections

Create new sections in `src/components/`:

```typescript
// src/components/FeaturesSection.tsx
import React from 'react';
import { Star, Zap, Shield } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Star,
      title: 'Feature 1',
      description: 'Description of your feature'
    },
    {
      icon: Zap,
      title: 'Feature 2', 
      description: 'Description of your feature'
    },
    {
      icon: Shield,
      title: 'Feature 3',
      description: 'Description of your feature'
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-12">
          Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card rounded-lg p-6 border border-border">
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
```

### Update Main Page

Add new sections to `src/pages/Index.tsx`:

```typescript
import FeaturesSection from '@/components/FeaturesSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};
```

## 🌐 Deployment

### GitHub Pages

The template is configured for GitHub Pages deployment:

1. **Automatic Deployment**: Pushes to `main` branch automatically deploy
2. **Custom Domain**: Add a `CNAME` file to `/public/` for custom domains
3. **Base Path**: Update `vite.config.ts` base path for your repository name

### Other Platforms

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Build the project
npm run build

# Deploy dist folder to Netlify
# Or connect your GitHub repository for automatic deployments
```

## 🔧 Advanced Customization

### Adding New Dependencies

```bash
# Add UI libraries
npm install framer-motion @headlessui/react

# Add utility libraries
npm install lodash date-fns

# Add development tools
npm install --save-dev @types/lodash
```

### Custom Hooks

Create custom hooks in `src/hooks/`:

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

### Custom Utilities

Add utilities in `src/lib/`:

```typescript
// src/lib/api.ts
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
```

## 📝 Content Management

### Static Content

Replace content in components directly for static sites.

### Dynamic Content

For dynamic content, consider:

1. **Headless CMS**: Strapi, Contentful, Sanity
2. **Static Site Generators**: Add markdown support
3. **API Integration**: Connect to your backend API

## 🎯 Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

### Code Splitting

```typescript
// Lazy load components
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Use with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>
```

### Image Optimization

```typescript
// Use next-gen image formats
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <source srcSet="image.avif" type="image/avif" />
  <img src="image.jpg" alt="Description" />
</picture>
```

## 🔒 Security

### Environment Variables

Create `.env` files for different environments:

```bash
# .env.local
VITE_API_URL=http://localhost:3000
VITE_APP_VERSION=1.0.0

# .env.production
VITE_API_URL=https://api.yourdomain.com
VITE_APP_VERSION=1.0.0
```

### Content Security Policy

Update security headers in deployment platform or add meta tags:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

## 🧪 Testing

### Unit Tests

```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../ui/button';

describe('Button', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### E2E Tests

```typescript
// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Your Hero Title')).toBeVisible();
});
```

## 📖 Documentation

### Update Documentation

1. **README.md**: Replace with your project's README
2. **docs/**: Add your project's documentation
3. **CHANGELOG.md**: Track your project's changes
4. **API docs**: Document your API endpoints

### JSDoc Comments

```typescript
/**
 * Calculates the total price including tax
 * @param price - The base price
 * @param taxRate - The tax rate (0.1 for 10%)
 * @returns The total price including tax
 */
function calculateTotal(price: number, taxRate: number): number {
  return price * (1 + taxRate);
}
```

## 🎉 Final Steps

1. **Test Everything**: Run all tests and check functionality
2. **Performance**: Run Lighthouse audits
3. **Security**: Check for vulnerabilities
4. **Documentation**: Update all documentation
5. **Deploy**: Deploy to your chosen platform

## 📞 Support

If you need help customizing the template:

- **GitHub Issues**: [Report issues](https://github.com/tiation/tiation-react-template/issues)
- **Discussions**: [Join discussions](https://github.com/tiation/tiation-react-template/discussions)
- **Email**: [tiatheone@protonmail.com](mailto:tiatheone@protonmail.com)

Happy coding! 🚀
