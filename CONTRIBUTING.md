# Contributing

Thank you for your interest in contributing! Here are some guidelines and information for contributors.

## Overview
Feel free to contribute by reporting issues, suggesting enhancements, or submitting pull requests.

## Code of Conduct
By participating, you agree to abide by our Code of Conduct.

## Getting Started

1. **Fork the Repository**
   ```bash
   git clone git@github.com:your-username/abundant-aussie-web.git
   cd abundant-aussie-web
   ```

2. **Set Up Development Environment**
   Follow the [docs/SETUP.md](./docs/SETUP.md) guide for detailed setup instructions.

3. **Install Dependencies**
   ```bash
   bun install
   ```

4. **Start Development Server**
   ```bash
   bun run dev
   ```

## Reporting Bugs or Suggesting Enhancements
Please check existing issues before creating a new one.

## Submitting Pull Requests

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow coding standards
   - Update documentation as needed

3. **Test Changes**
   ```bash
   bun run build
   bun run lint
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

5. **Push to Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Use descriptive title and description
   - Reference related issues

## Development Guidelines

### Performance
Optimize images, assets and minimize bundle size.

### Security
Follow secure coding practices.

### Accessibility
Maintain sufficient color contrast and test with screen readers.

### Testing
Ensure tests pass before creating a pull request.

Thank you for your contributions!

---

*This guide is maintained by the ChaseWhiteRabbit NGO development team.*
