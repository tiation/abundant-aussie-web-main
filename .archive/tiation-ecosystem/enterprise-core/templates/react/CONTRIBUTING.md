# Contributing to Tiation Wellness Hub

Thank you for considering contributing to Tiation Wellness Hub! We welcome contributions from the community and are excited to work with you.

## 🤝 How to Contribute

### Issues
- **Bug Reports**: If you find a bug, please create an issue with detailed steps to reproduce
- **Feature Requests**: We welcome suggestions for new features or improvements
- **Questions**: Feel free to ask questions about the codebase or project

### Pull Requests
1. Fork the repository
2. Create a new branch for your feature/bugfix
3. Make your changes following our coding standards
4. Test your changes thoroughly
5. Submit a pull request with a clear description

## 📋 Development Setup

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher

### Local Development
```bash
# Clone your fork
git clone https://github.com/your-username/tiation-wellness-hub.git
cd tiation-wellness-hub

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Lint code
npm run lint
```

## 🎯 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Follow strict type checking
- Use proper JSDoc comments for complex functions
- Prefer interfaces over types when possible

### React
- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Write tests for all components

### Styling
- Use Tailwind CSS utility classes
- Follow the existing design system
- Maintain dark neon theme consistency
- Use responsive design principles

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Use meaningful variable names
- Write clear, concise comments

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
- Write unit tests for all utility functions
- Write integration tests for components
- Maintain high test coverage
- Use descriptive test names

## 📝 Commit Messages

We use conventional commits for clear commit history:

```
feat: add new wellness tracking feature
fix: resolve mobile navigation bug
docs: update API documentation
style: improve button hover effects
refactor: optimize performance of dashboard
test: add tests for meditation timer
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## 🔍 Code Review Process

### Pull Request Guidelines
1. **Clear Description**: Describe what changes you made and why
2. **Small PRs**: Keep pull requests focused and manageable
3. **Testing**: Include tests for new features
4. **Documentation**: Update docs if needed
5. **Screenshots**: Include screenshots for UI changes

### Review Checklist
- [ ] Code follows project standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Responsive design works properly
- [ ] Accessibility standards met

## 🏗️ Architecture Guidelines

### Component Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── layout/       # Layout components
│   └── wellness/     # Wellness-specific components
├── pages/            # Route pages
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── types/            # TypeScript types
└── styles/           # Global styles
```

### Best Practices
- Keep components small and focused
- Use custom hooks for complex logic
- Implement proper error boundaries
- Follow accessibility guidelines
- Optimize for performance

## 🚀 Deployment

### GitHub Pages
- Automatic deployment on merge to main
- Build optimization for production
- Asset optimization and caching
- HTTPS enforcement

### Preview Deployments
- Preview builds for all pull requests
- Automatic testing on multiple environments
- Performance monitoring

## 📞 Getting Help

### Community Support
- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For general questions and ideas
- **Email**: [tiatheone@protonmail.com](mailto:tiatheone@protonmail.com)

### Enterprise Support
For enterprise support or custom development:
- Email: [tiatheone@protonmail.com](mailto:tiatheone@protonmail.com)
- Include "Enterprise Support" in subject line

## 🎨 Design System

### Colors
- Primary: Cyan (#00FFFF)
- Secondary: Magenta (#FF00FF)
- Background: Dark (#0A0A0A)
- Text: White (#FFFFFF)

### Typography
- Primary: Inter
- Display: Playfair Display
- Monospace: JetBrains Mono

### Components
Follow the established design system for consistency across all components.

## 🔒 Security

### Reporting Security Issues
If you discover a security issue, please email [tiatheone@protonmail.com](mailto:tiatheone@protonmail.com) directly instead of creating a public issue.

### Security Guidelines
- Never commit sensitive data
- Use environment variables for secrets
- Follow OWASP guidelines
- Validate all user inputs

## 📄 License

By contributing to Tiation Wellness Hub, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for helping make Tiation Wellness Hub better! 🌟
