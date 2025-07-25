#!/bin/bash

# Enhanced contact section to add to all Rigger repositories
CONTACT_SECTION='
## 📧 Contact Information

### Primary Maintainers

For inquiries related to the Rigger ecosystem, please contact our primary maintainers:

- **Jack Jonas**: [jackjonas95@gmail.com](mailto:jackjonas95@gmail.com)
  - **Role**: Rigger Crane Operator & Heavy Vehicle Mechanic, based in Karratha, WA
  - **Expertise**: Practical rigging operations, safety protocols, and industry requirements

- **Tia Astor**: [tiatheone@protonmail.com](mailto:tiatheone@protonmail.com)
  - **Role**: Swedish Software Developer with ChaseWhiteRabbit NGO
  - **Mission**: Creating ethical technology to empower blue-collar workers

These maintainers oversee the development and coordination of the entire Rigger platform ecosystem, including RiggerConnect, RiggerHub, RiggerBackend, and RiggerShared repositories.

### Special Mentions

**Jack Jonas** brings invaluable real-world experience as a rigger crane operator and heavy vehicle mechanic working in the challenging conditions of Western Australia'\''s mining and construction sectors. His deep understanding of the transient rigging industry ensures that our technology solutions meet the practical needs of riggers who depend on reliable tools to find work and manage their careers in demanding environments.

**Tia Astor** develops this technology as part of ChaseWhiteRabbit NGO'\''s mission to create ethical, worker-empowering software solutions. Her commitment to supporting valuable blue-collar work drives the development of tools that are as robust and reliable as they are innovative, prioritizing user empowerment over corporate profit.

### Project Vision

This SaaS platform aims to provide Jack and riggers like him with much-needed services in the transient rigging industry, while enabling Tia to further the humanitarian work of ChaseWhiteRabbit NGO. Together, they'\''re building technology that lifts up workers rather than replacing them.

### Enterprise Standards & Compliance

- **GPL v3 License**: Ensures all improvements remain freely accessible and ethically governed
- **Enterprise-Grade Security**: Multi-factor authentication, encrypted data storage, and secure API communications
- **CI/CD Pipeline**: Automated testing, building, and deployment through GitLab CI/CD
- **Cross-Platform Consistency**: Maintains feature parity across all platforms and devices

### Cross-Platform Ecosystem Links

Explore the complete Rigger ecosystem:

- **Web Platforms**:
  - 🌐 [RiggerConnect-web](../RiggerConnect-web/) - Professional networking web platform
  - 🌐 [RiggerHub-web](../RiggerHub-web/) - Operations management hub

- **Mobile Applications**:
  - 📱 [RiggerConnect-android](../RiggerConnect-android/) - Android networking application
  - 📱 [RiggerConnect-ios](../RiggerConnect-ios/) - iOS networking application
  - 📱 [RiggerHub-android](../RiggerHub-android/) - Android operations management
  - 📱 [RiggerHub-ios](../RiggerHub-ios/) - iOS operations management

- **Backend & Shared**:
  - ⚙️ [RiggerBackend](../RiggerBackend/) - Core API services and backend infrastructure
  - 📚 [RiggerShared](../RiggerShared/) - Shared libraries and utilities across platforms

These interconnected repositories form a comprehensive ecosystem designed to serve the rigging industry from every angle.
'

# List of repositories to update
REPOS=("RiggerHub-web" "RiggerHub-android" "RiggerHub-ios" "RiggerShared" "RiggerBackend")

echo "🏗️ Updating Rigger ecosystem READMEs with enhanced contact information..."

for repo in "${REPOS[@]}"; do
    echo "=== Processing $repo ==="
    
    cd "/Users/tiaastor/Github/tiation-repos/$repo"
    
    # Check if README.md exists
    if [[ -f "README.md" ]]; then
        # Add enhanced contact section if it doesn't exist
        if ! grep -q "jackjonas95@gmail.com" README.md; then
            echo "$CONTACT_SECTION" >> README.md
            echo "✅ Added enhanced contact section to $repo"
        else
            echo "⚠️ Contact information already exists in $repo"
        fi
        
        # Commit and push changes
        git add README.md
        git commit -m "Add enhanced contact section with special mentions for Jack Jonas and Tia Astor, cross-platform ecosystem links"
        git push origin main
        
        echo "✅ Successfully updated and pushed $repo"
    else
        echo "❌ README.md not found in $repo"
    fi
    
    echo ""
done

echo "🎉 All Rigger ecosystem READMEs have been updated!"
