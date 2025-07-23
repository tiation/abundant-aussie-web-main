# RiggerConnect Business Platform

A modern web application for construction businesses to manage job postings, worker search, compliance, and recruitment processes.

## 🚀 Features

### Core Business Functions
- **Job Posting**: Create and manage job listings with detailed requirements and compensation
- **Worker Search**: Find qualified construction workers with advanced filtering
- **Compliance Management**: Track certifications, safety training, and regulatory compliance
- **Recruitment Processing**: Manage hiring pipeline from application to offer

### Technical Features
- **React 18** with TypeScript for modern development
- **Vite** for fast development and building
- **Tailwind CSS** for responsive, utility-first styling
- **shadcn/ui** components for consistent design
- **React Router** for client-side routing
- **Lucide React** for comprehensive icon library

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom shadcn/ui components
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Development**: ESLint, TypeScript strict mode

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Base UI components (Button, Card, Input, etc.)
│   ├── business/     # Business-specific components
│   └── shared/       # Shared layout components
├── pages/
│   ├── jobs/         # Job posting pages
│   ├── workers/      # Worker search pages
│   ├── compliance/   # Compliance management pages
│   └── recruitment/  # Recruitment processing pages
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── hooks/            # Custom React hooks
└── services/         # API service functions
```

## 🎨 Design System

The application uses a consistent design system based on:
- **Primary Color**: Orange (#f27318) - representing construction industry energy
- **Component Library**: Custom shadcn/ui components for consistency
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Typography**: Inter font family for modern readability

## 📋 Pages & Features

### Dashboard
- Overview of active jobs, applications, and key metrics
- Quick actions for common tasks
- Recent activity and notifications

### Job Posting
- Comprehensive job creation form
- Skills and requirements management
- Compensation and schedule settings
- Draft saving and preview functionality

### Worker Search
- Advanced search and filtering capabilities
- Worker profiles with ratings and certifications
- Contact and communication tools
- Availability status tracking

### Compliance Management
- Certification tracking and verification
- Safety training management
- Incident reporting and documentation
- Expiration monitoring and alerts

### Recruitment Processing
- Visual recruitment pipeline
- Candidate progress tracking
- Interview scheduling and management
- Application status management

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Path Aliases
The project uses TypeScript path mapping for clean imports:
- `@/*` maps to `./src/*`

### Tailwind Configuration
Custom color scheme and component classes are defined in:
- `tailwind.config.js` - Main configuration
- `src/index.css` - Custom utility classes

## 🎯 Enterprise Features

The platform is designed with enterprise-grade features:
- **Scalable Architecture**: Modular component structure
- **Type Safety**: Full TypeScript coverage
- **Responsive Design**: Works on all device sizes
- **Accessibility**: Following WCAG guidelines
- **Performance**: Optimized builds with Vite

## 🔒 Best Practices

- **Code Organization**: Clear separation of concerns
- **Type Safety**: Comprehensive TypeScript usage
- **Component Design**: Reusable and composable components
- **State Management**: Local state with hooks
- **Styling**: Utility-first CSS with Tailwind

---

Built with ❤️ for the construction industry, following enterprise-grade development practices and modern web standards.
