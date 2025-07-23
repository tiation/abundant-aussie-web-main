# @rigger/shared

A comprehensive shared library for the Rigger ecosystem containing TypeScript interfaces, Zod validation schemas, utility functions, and reusable UI components.

## 🚀 Features

- **TypeScript Types**: Complete type definitions for jobs, users, applications, and more
- **Zod Schemas**: Runtime validation schemas with type inference
- **UI Components**: Reusable React components with consistent styling
- **Utility Functions**: Common formatting and helper functions
- **Enterprise Grade**: Built with DevOps best practices and striking design

## 📦 Installation

```bash
npm install @rigger/shared
# or
yarn add @rigger/shared
# or
pnpm add @rigger/shared
```

## 🏗️ Usage

### Types

```typescript
import { Job, RiggerProfile, JobType, JobStatus } from '@rigger/shared/types';

const job: Job = {
  id: '123',
  title: 'Concert Lighting Technician',
  type: JobType.LIGHTING,
  status: JobStatus.POSTED,
  // ... other properties
};
```

### Validation Schemas

```typescript
import { JobSchema, CreateJobSchema } from '@rigger/shared/schemas';

// Validate existing data
const result = JobSchema.safeParse(jobData);
if (result.success) {
  console.log('Valid job:', result.data);
} else {
  console.log('Validation errors:', result.error.errors);
}

// Validate form data
const createJobResult = CreateJobSchema.safeParse(formData);
```

### Components

```typescript
import { Button, Modal, JobCard } from '@rigger/shared/components';

function MyComponent() {
  return (
    <>
      <Button variant="primary" size="lg" onClick={handleClick}>
        Apply Now
      </Button>
      
      <JobCard 
        job={jobData} 
        onClick={handleJobClick}
        showApplicantCount={true}
      />
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleClose}
        title="Job Details"
        size="lg"
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
}
```

### Utilities

```typescript
import { 
  formatCurrency, 
  formatDate, 
  formatDuration,
  cn,
  calculateProfileCompleteness 
} from '@rigger/shared/utils';

// Format currency
const price = formatCurrency(1500, 'USD'); // "$1,500.00"

// Format dates
const dateStr = formatDate(new Date(), 'relative'); // "2 hours ago"

// Combine CSS classes
const className = cn('base-class', condition && 'conditional-class');

// Calculate profile completeness
const completeness = calculateProfileCompleteness(userProfile); // 85
```

## 🎨 Styling

This package uses Tailwind CSS for styling. Make sure your project has Tailwind CSS configured with the following classes available:

- Utility classes for spacing, colors, typography
- Custom animations and transitions
- Responsive design utilities

### Required Tailwind Configuration

Add these to your `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    // ... your content paths
    './node_modules/@rigger/shared/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      // Custom theme extensions if needed
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
};
```

## 📋 Available Components

### UI Components

- **Button**: Customizable button with variants and loading states
- **Input**: Input field with label, validation, and icon support
- **Modal**: Flexible modal dialog with backdrop and keyboard support

### Domain Components

- **JobCard**: Displays job information in a card format
- More components coming soon...

## 🔧 Types Overview

### Core Types

- `User`, `RiggerProfile`, `ClientProfile` - User-related types
- `Job`, `JobApplication`, `Milestone` - Job-related types
- `Equipment`, `Certification`, `PortfolioItem` - Supporting types

### Enums

- `JobType`, `JobCategory`, `JobStatus` - Job classifications
- `ExperienceLevel`, `VerificationStatus` - User attributes
- `Priority`, `ApplicationStatus` - Status indicators

### API Types

- `ApiResponse<T>`, `PaginatedResponse<T>` - API response wrappers
- `JobSearchFilters`, `RiggerSearchFilters` - Search parameters

## 🛠️ Development

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Basic UI components
│   └── JobCard.tsx     # Domain-specific components
├── types/              # TypeScript type definitions
│   └── core.ts         # Core data models
├── schemas/            # Zod validation schemas
│   └── validation.ts   # Schema definitions
├── utils/              # Utility functions
│   ├── cn.ts          # Class name utility
│   └── formatters.ts  # Formatting functions
└── index.ts           # Main export file
```

## 🏢 ChaseWhiteRabbit NGO

This package is developed and maintained by ChaseWhiteRabbit NGO as part of the Rigger ecosystem, connecting skilled riggers with opportunities in the entertainment and events industry.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please reach out to:
- Email: tiatheone@protonmail.com
- Technical Lead: garrett@sxc.codes

---

Built with ❤️ for the entertainment industry by ChaseWhiteRabbit NGO
