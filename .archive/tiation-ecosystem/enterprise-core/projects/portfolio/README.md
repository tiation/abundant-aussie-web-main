## Screenshots

![Tiation Portfolio Screenshot](../screenshot-tiation-portfolio.jpeg)

# Tiation Portfolio - Enterprise Web Solutions

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://tiation-portfolio.github.io)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Made with](https://img.shields.io/badge/Made%20with-HTML%2FCSS%2FJS-orange)]()

> **Comprehensive portfolio showcasing enterprise-grade web applications and solutions**

![Tiation Portfolio Banner](https://img.shields.io/badge/🏢_TIATION_PORTFOLIO-Enterprise_Showcase-00FFFF?style=for-the-badge&labelColor=0A0A0A&color=00FFFF)

## 🚀 Live Demo

**[View Portfolio →](https://tiation-portfolio.github.io)**

## 📋 Overview

This portfolio showcases a comprehensive collection of enterprise-grade web applications and solutions, featuring:

- **Company Intranet Template** - Modern Vue.js enterprise portal
- **D&D Dice Roller SaaS** - Full-stack subscription platform  
- **Enterprise Framework** - Professional solution templates

## ✨ Features

### 🎨 **Modern Design**
- Responsive design that works on all devices
- Professional enterprise aesthetic with Tiation brand colors
- Smooth animations and interactive elements
- Dark/light theme considerations

### 📱 **Multi-Page Structure**
- **Home** - Portfolio overview and hero section
- **Projects** - Detailed project showcases with technical specs
- **Documentation** - Comprehensive technical documentation
- **Guides** - Step-by-step implementation tutorials
- **About** - Company information and technology expertise
- **Contact** - Professional contact forms and information

### 🛠️ **Interactive Features**
- Project filtering and search functionality
- API testing interface for dice roller project
- Responsive navigation with mobile support
- Contact forms with validation
- Code examples with syntax highlighting

### 📚 **Comprehensive Documentation**
- Technical API references
- Deployment guides for multiple platforms
- Architecture documentation
- Troubleshooting and FAQ sections

## 🏗️ Technical Architecture

### **Frontend Stack**
- **HTML5** - Semantic markup and accessibility
- **CSS3** - Modern styling with custom properties and animations
- **Vanilla JavaScript** - Interactive features and API integrations
- **Responsive Design** - Mobile-first approach with CSS Grid/Flexbox

### **Content Structure**
```
tiation-portfolio/
├── index.html              # Main portfolio page
├── pages/                  # Additional pages
│   ├── projects.html       # Detailed project showcase
│   ├── about.html         # Company information
│   └── contact.html       # Contact forms
├── docs/                  # Documentation
│   └── index.html         # Technical documentation hub
├── guides/                # Implementation guides
│   └── index.html         # Tutorial and guides hub
├── assets/                # Static assets
│   ├── images/           # Image assets
│   └── screenshots/      # Project screenshots
├── styles.css            # Main stylesheet
├── script.js            # JavaScript functionality
└── _config.yml          # Jekyll configuration
```

### **Key Features**
- **GitHub Pages Ready** - Automatic deployment configuration
- **SEO Optimized** - Meta tags, structured data, and semantic HTML
- **Performance Optimized** - Minified assets and optimized loading
- **Accessibility** - WCAG compliant with proper ARIA attributes

## 🚀 Quick Start

### **View Online**
The portfolio is deployed and accessible at: **https://tiation-portfolio.github.io**

### **Local Development**
```bash
# Clone the repository
git clone https://github.com/your-username/tiation-portfolio.git
cd tiation-portfolio

# Open in browser (or use a local server)
open index.html

# Or serve with Python
python3 -m http.server 8080
```

### **GitHub Pages Setup**
1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Select source: Deploy from a branch (main)
4. Your portfolio will be available at: `https://username.github.io/tiation-portfolio`

## 📖 Documentation Structure

### **Technical Documentation** (`/docs/`)
- **Overview** - Technology stack and architecture
- **API Reference** - Comprehensive API documentation
- **Deployment Guides** - Multiple deployment strategies
- **Security** - Security best practices and implementation

### **Implementation Guides** (`/guides/`)
- **Quick Start** - Get up and running in 10 minutes
- **Environment Setup** - Development environment configuration
- **Deployment Tutorials** - Step-by-step deployment guides
- **Customization** - Branding and feature customization
- **Integration** - API and system integration guides
- **Troubleshooting** - Common issues and solutions

## 🎯 Featured Projects

### **1. Company Intranet Portal** 🏢
- **Tech Stack**: Vue 3, TypeScript, Tailwind CSS, Pinia
- **Features**: Employee directory, project management, real-time dashboard
- **Live Demo**: [View Intranet →](https://tiation.github.io/company-intranet)
- **GitHub**: [Source Code →](https://github.com/tiation/tiation-company-intranet-template)

### **2. D&D Dice Roller SaaS** 🎲
- **Tech Stack**: Node.js, React, PostgreSQL, Stripe
- **Features**: API-driven dice rolling, subscription management, team collaboration
- **GitHub**: [Source Code →](https://github.com/tiation/tiation-dice-roller-marketing-site)
- **API Testing**: Interactive testing interface available in portfolio

### **3. Enterprise Solution Framework** 🔮
- **Tech Stack**: Modern web technologies, comprehensive documentation
- **Features**: Professional templates, architecture patterns, deployment guides
- **Live Demo**: [View Framework →](https://tiation.github.io/dontbeacunt)
- **GitHub**: [Source Code →](https://github.com/tiation/dontbeacunt)

## 🎨 Customization

### **Brand Colors**
```css
:root {
    --primary-cyan: #00FFFF;
    --primary-magenta: #FF00FF;
    --dark-bg: #0A0A0A;
    --light-bg: #FFFFFF;
}
```

### **Typography**
```css
:root {
    --font-family: 'Inter', sans-serif;
    --font-size-base: 1rem;
    --font-size-4xl: 2.25rem;
}
```

### **Content Updates**
- Update `_config.yml` for site configuration
- Modify project data in HTML files
- Update contact information in `pages/contact.html`
- Customize about content in `pages/about.html`

## 🚀 Deployment Options

### **1. GitHub Pages (Recommended)**
- Automatic deployment from repository
- Custom domain support
- SSL certificates included
- No server management required

### **2. Static Hosting Platforms**
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based continuous deployment
- **Surge.sh**: Command-line deployment

### **3. Traditional Web Hosting**
- Upload files via FTP/SFTP
- Configure web server (Apache/Nginx)
- Set up SSL certificates

## 📊 Performance Features

- **Optimized Loading** - Lazy loading and efficient asset management
- **SEO Ready** - Meta tags, structured data, and semantic HTML
- **Mobile Optimized** - Responsive design with mobile-first approach
- **Fast Navigation** - Smooth transitions and preloaded content
- **Accessibility** - WCAG 2.1 AA compliant

## 🛠️ Development

### **Local Development Setup**
```bash
# Clone repository
git clone https://github.com/tiation/tiation-portfolio.git

# Navigate to project
cd tiation-portfolio

# Jekyll Development Server (Recommended)
jekyll serve --port 4000 --host 127.0.0.1
# Site will be available at: http://127.0.0.1:4000/tiation-portfolio/

# Alternative: Simple HTTP servers
python3 -m http.server 8080
# or
npx serve .
# or
php -S localhost:8080
```

### **Jekyll Configuration**
- **Local URL**: `http://127.0.0.1:4000/tiation-portfolio/`
- **Production URL**: `https://tiation.github.io/tiation-portfolio/`
- **Auto-regeneration**: Enabled for live reloading during development
- **Build time**: ~0.24 seconds (optimized for fast development)

### **File Structure**
- **Static Files** - No build process required
- **Modern CSS** - Custom properties and modern features
- **Vanilla JS** - No framework dependencies
- **Progressive Enhancement** - Works without JavaScript

### **Code Standards**
- **HTML5** - Semantic markup and accessibility
- **CSS3** - BEM methodology and modern features
- **JavaScript** - ES6+ features and modern practices
- **Performance** - Optimized loading and minimal dependencies

## 📞 Support & Contact

### **Community Support**
- **GitHub Issues**: [Report issues or ask questions](https://github.com/tiation/tiation-portfolio/issues)
- **Documentation**: [Browse comprehensive guides](https://tiation-portfolio.github.io/docs/)
- **Email**: [tiatheone@protonmail.com](mailto:tiatheone@protonmail.com)

### **Enterprise Support**
For enterprise customers, we offer:
- Priority support and consultation
- Custom development and integration
- Training and best practices guidance
- SLA guarantees and dedicated support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Process**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Areas for Contribution**
- Additional project showcases
- Documentation improvements
- Performance optimizations
- Accessibility enhancements
- Mobile experience improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- **Design Inspiration** - Modern enterprise web design patterns
- **Technical Stack** - Built with proven web technologies
- **Open Source** - Committed to open source principles
- **Community** - Thanks to the developer community for inspiration and feedback

---

<div align="center">

**Built with ❤️ by the [Tiation Team](https://github.com/tiation)**

[![GitHub](https://img.shields.io/badge/GitHub-tiation-blue?logo=github)](https://github.com/tiation)
[![Portfolio](https://img.shields.io/badge/Portfolio-Live-brightgreen)](https://tiation-portfolio.github.io)
[![Email](https://img.shields.io/badge/Email-Contact-red)](mailto:tiatheone@protonmail.com)

</div>