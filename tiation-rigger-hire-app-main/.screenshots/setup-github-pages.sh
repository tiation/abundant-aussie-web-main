#!/bin/bash

# GitHub Pages Setup Script for Tiation Repositories
# Enables professional documentation hosting with dark neon theme

set -e

echo "🌐 Setting up GitHub Pages for professional documentation..."

# Key repositories for GitHub Pages deployment
PAGES_REPOS=(
    "tiation-github-pages-theme"
    "tiation-ai-agents"
    "tiation-ai-platform"
    "tiation-terminal-workflows"
    "tiation-docker-debian"
    "liberation-system"
    "tiation-docs"
    "tiation-automation-workspace"
    "tiation-cms"
    "tiation-private-ai-chat"
)

# Function to create GitHub Pages configuration
setup_github_pages() {
    local repo_name="$1"
    local repo_path="/Users/tiaastor/tiation-github/$repo_name"
    
    if [[ ! -d "$repo_path" ]]; then
        echo "⚠️  Repository not found: $repo_path"
        return
    fi
    
    echo "📄 Setting up GitHub Pages for: $repo_name"
    
    cd "$repo_path"
    
    # Create or update _config.yml for GitHub Pages
    cat > "_config.yml" << EOF
# GitHub Pages Configuration for $repo_name
# Dark Neon Theme with Cyan Gradient Flares

title: "$(echo $repo_name | sed 's/-/ /g' | sed 's/\b\w/\U&/g')"
description: "Enterprise-grade solution with professional documentation and dark neon theme"
baseurl: "/$repo_name"
url: "https://tiaastor.github.io"

# Theme Configuration
theme: jekyll-theme-cayman
plugins:
  - jekyll-sitemap
  - jekyll-seo-tag
  - jekyll-feed

# SEO and Social
author:
  name: "Tia Astor"
  email: "tia@tiation.com"
  github: "TiaAstor"

social:
  github: "TiaAstor"
  twitter: "TiaAstor"

# GitHub Pages Settings
repository: "TiaAstor/$repo_name"
github_username: "TiaAstor"

# Navigation
navigation:
  - title: "Home"
    url: "/"
  - title: "Documentation"
    url: "/docs/"
  - title: "API Reference"
    url: "/api/"
  - title: "GitHub"
    url: "https://github.com/TiaAstor/$repo_name"

# Markdown Settings
markdown: kramdown
kramdown:
  syntax_highlighter: rouge
  syntax_highlighter_opts:
    css_class: 'highlight'
    span:
      line_numbers: false
    block:
      line_numbers: true

# Exclude from processing
exclude:
  - node_modules/
  - vendor/
  - .bundle/
  - .sass-cache/
  - .jekyll-cache/
  - gemfiles/
  - Gemfile
  - Gemfile.lock
  - README_OLD.md
  - scripts/
  - .git/
  - .github/

# Include
include:
  - .htaccess
  - _pages
  - docs/
  - api/

# Collections
collections:
  docs:
    output: true
    permalink: /:collection/:name/
  examples:
    output: true
    permalink: /:collection/:name/

# Default settings
defaults:
  - scope:
      path: ""
      type: "pages"
    values:
      layout: "default"
      author: "Tia Astor"
  - scope:
      path: ""
      type: "posts"
    values:
      layout: "post"
      author: "Tia Astor"
  - scope:
      path: ""
      type: "docs"
    values:
      layout: "doc"
      nav: true

# Custom variables
custom:
  theme_color: "#00D9FF"
  accent_color: "#FF0080"
  background_color: "#0A0A0A"
  text_color: "#FFFFFF"
  highlight_color: "#00FF88"
EOF

    # Create docs directory structure
    mkdir -p docs/{api,guides,examples,architecture}
    
    # Create index.html for custom styling
    cat > "index.html" << EOF
---
layout: default
title: "Home"
---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ site.title }}</title>
    <style>
        :root {
            --primary-color: #00D9FF;
            --secondary-color: #00FF88;
            --accent-color: #FF0080;
            --background-color: #0A0A0A;
            --card-background: #1A1A1A;
            --text-color: #FFFFFF;
        }
        
        body {
            background: var(--background-color);
            color: var(--text-color);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        
        .hero {
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            padding: 4rem 2rem;
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .hero h1 {
            font-size: 3rem;
            margin: 0;
            text-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
        }
        
        .hero p {
            font-size: 1.2rem;
            margin: 1rem 0;
            opacity: 0.9;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }
        
        .feature-card {
            background: var(--card-background);
            padding: 2rem;
            border-radius: 10px;
            border: 1px solid var(--primary-color);
            box-shadow: 0 0 20px rgba(0, 217, 255, 0.1);
            transition: transform 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 30px rgba(0, 217, 255, 0.2);
        }
        
        .feature-card h3 {
            color: var(--primary-color);
            margin-top: 0;
        }
        
        .cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin: 2rem 0;
            flex-wrap: wrap;
        }
        
        .cta-button {
            background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
            color: var(--background-color);
            text-decoration: none;
            padding: 1rem 2rem;
            border-radius: 5px;
            font-weight: bold;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 217, 255, 0.3);
        }
        
        .footer {
            background: var(--card-background);
            padding: 2rem;
            text-align: center;
            margin-top: 4rem;
            border-top: 1px solid var(--primary-color);
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2rem;
            }
            
            .cta-buttons {
                flex-direction: column;
                align-items: center;
            }
        }
    </style>
</head>
<body>
    <div class="hero">
        <h1>{{ site.title }}</h1>
        <p>{{ site.description }}</p>
        <div class="cta-buttons">
            <a href="#documentation" class="cta-button">
                📚 Documentation
            </a>
            <a href="#demo" class="cta-button">
                🚀 Live Demo
            </a>
            <a href="{{ site.repository }}" class="cta-button">
                💻 GitHub
            </a>
        </div>
    </div>
    
    <div class="container">
        <div class="features">
            <div class="feature-card">
                <h3>🎯 Enterprise Grade</h3>
                <p>Professional solution built with enterprise standards and best practices in mind.</p>
            </div>
            <div class="feature-card">
                <h3>🔒 Secure & Reliable</h3>
                <p>Security-first approach with comprehensive testing and validation.</p>
            </div>
            <div class="feature-card">
                <h3>⚡ High Performance</h3>
                <p>Optimized for speed and efficiency with modern development practices.</p>
            </div>
            <div class="feature-card">
                <h3>🎨 Dark Neon Theme</h3>
                <p>Beautiful dark interface with cyan gradient flares for modern aesthetics.</p>
            </div>
        </div>
        
        <div id="documentation">
            {{ content }}
        </div>
    </div>
    
    <div class="footer">
        <p>&copy; {{ site.time | date: '%Y' }} {{ site.author.name }}. All rights reserved.</p>
        <p>Built with ❤️ using Jekyll and GitHub Pages</p>
    </div>
</body>
</html>
EOF

    # Create GitHub Actions workflow for Pages deployment
    mkdir -p .github/workflows
    cat > ".github/workflows/pages.yml" << EOF
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1'
          bundler-cache: true
          
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v3
        
      - name: Build with Jekyll
        run: bundle exec jekyll build --baseurl "\${{ steps.pages.outputs.base_path }}"
        env:
          JEKYLL_ENV: production
          
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
EOF

    # Create Gemfile for Jekyll
    cat > "Gemfile" << EOF
source "https://rubygems.org"

gem "jekyll", "~> 4.3"
gem "jekyll-theme-cayman"
gem "jekyll-sitemap"
gem "jekyll-seo-tag"
gem "jekyll-feed"

# Performance booster for older systems
gem "webrick", "~> 1.7"
EOF

    echo "✅ GitHub Pages setup complete for $repo_name"
    
    # Commit and push changes
    git add .
    
    if ! git diff --cached --quiet; then
        git commit -m "feat: Add GitHub Pages configuration with dark neon theme

- Implemented Jekyll configuration with custom styling
- Added GitHub Actions workflow for automated deployment
- Created responsive dark neon theme with cyan gradient flares
- Configured SEO optimization and social media integration
- Added professional documentation structure

This enables live documentation hosting with enterprise-grade presentation."
        
        echo "✅ Committed GitHub Pages configuration for $repo_name"
        
        # Push to remote
        if git push origin main 2>/dev/null || git push origin master 2>/dev/null; then
            echo "✅ Pushed GitHub Pages setup for $repo_name"
        else
            echo "⚠️  Failed to push GitHub Pages setup for $repo_name"
        fi
    else
        echo "ℹ️  No changes to commit for $repo_name"
    fi
    
    echo "---"
}

# Process key repositories for GitHub Pages
for repo_name in "${PAGES_REPOS[@]}"; do
    setup_github_pages "$repo_name"
done

echo "🎉 GitHub Pages setup complete!"
echo ""
echo "📊 Next Steps:"
echo "   1. Enable GitHub Pages in repository settings"
echo "   2. Configure custom domain if desired"
echo "   3. Verify Jekyll builds successfully"
echo "   4. Test live documentation sites"
echo ""
echo "🔗 Your repositories now have professional documentation hosting!"
