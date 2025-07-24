#!/usr/bin/env python3
"""
Footer Validation Script for Tiation Repositories
Validates footer consistency across all README files
"""

import os
import re
import json
from pathlib import Path
from typing import List, Dict, Tuple

def find_readme_files(base_path: str) -> List[str]:
    """Find all README.md files in the repository"""
    readme_files = []
    for root, dirs, files in os.walk(base_path):
        # Skip node_modules and .git directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.archive']]
        
        for file in files:
            if file.lower() == 'readme.md':
                readme_files.append(os.path.join(root, file))
    
    return readme_files

def analyze_footer(file_path: str) -> Dict:
    """Analyze the footer section of a README file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return {"error": f"Could not read file: {e}"}
    
    # Look for footer patterns
    footer_analysis = {
        "has_tiation_link": "tiation.github.io" in content,
        "has_enterprise_mention": any(word in content.lower() for word in ["enterprise", "enterprise-grade"]),
        "has_ngo_mention": any(phrase in content.lower() for phrase in ["chasewhiterabbit", "ngo", "chase white rabbit"]),
        "has_footer_section": bool(re.search(r'---\s*$', content, re.MULTILINE)),
        "has_centered_footer": "<div align=\"center\">" in content or "align=\"center\"" in content,
        "has_built_with": "built with" in content.lower() or "powered by" in content.lower(),
        "content_length": len(content),
        "ends_with_footer": content.strip().endswith("</div>") or content.strip().endswith("---"),
    }
    
    # Extract potential footer content (last 500 characters)
    footer_content = content[-500:] if len(content) > 500 else content
    footer_analysis["footer_preview"] = footer_content.replace('\n', '\\n')
    
    return footer_analysis

def validate_all_footers(base_path: str) -> Dict:
    """Validate footers across all README files"""
    readme_files = find_readme_files(base_path)
    results = {}
    
    for file_path in readme_files:
        relative_path = os.path.relpath(file_path, base_path)
        results[relative_path] = analyze_footer(file_path)
    
    return results

def generate_report(results: Dict) -> str:
    """Generate a comprehensive validation report"""
    report = ["# Footer Validation Report", ""]
    
    # Summary statistics
    total_files = len(results)
    files_with_tiation_link = sum(1 for r in results.values() if r.get("has_tiation_link", False))
    files_with_ngo_mention = sum(1 for r in results.values() if r.get("has_ngo_mention", False))
    files_with_enterprise = sum(1 for r in results.values() if r.get("has_enterprise_mention", False))
    files_with_footer = sum(1 for r in results.values() if r.get("has_footer_section", False))
    
    report.extend([
        f"## Summary Statistics",
        f"- **Total README files analyzed**: {total_files}",
        f"- **Files with tiation.github.io link**: {files_with_tiation_link} ({files_with_tiation_link/total_files*100:.1f}%)",
        f"- **Files with NGO mention**: {files_with_ngo_mention} ({files_with_ngo_mention/total_files*100:.1f}%)",
        f"- **Files with enterprise mention**: {files_with_enterprise} ({files_with_enterprise/total_files*100:.1f}%)",
        f"- **Files with footer section**: {files_with_footer} ({files_with_footer/total_files*100:.1f}%)",
        ""
    ])
    
    # Files missing key elements
    report.append("## Files Missing Key Elements")
    report.append("")
    
    missing_tiation = [path for path, data in results.items() 
                      if not data.get("has_tiation_link", False) and not data.get("error")]
    if missing_tiation:
        report.append("### Missing tiation.github.io Link:")
        for path in missing_tiation[:10]:  # Show first 10
            report.append(f"- {path}")
        if len(missing_tiation) > 10:
            report.append(f"- ... and {len(missing_tiation) - 10} more")
        report.append("")
    
    missing_ngo = [path for path, data in results.items() 
                   if not data.get("has_ngo_mention", False) and not data.get("error")]
    if missing_ngo:
        report.append("### Missing NGO Mention:")
        for path in missing_ngo[:10]:  # Show first 10
            report.append(f"- {path}")
        if len(missing_ngo) > 10:
            report.append(f"- ... and {len(missing_ngo) - 10} more")
        report.append("")
    
    # Priority files for review (main project READMEs)
    priority_files = [path for path in results.keys() 
                     if path.count('/') <= 1 and 'README.md' in path]
    
    if priority_files:
        report.append("## Priority Files Analysis (Main Project READMEs)")
        report.append("")
        for path in priority_files:
            data = results[path]
            if data.get("error"):
                report.append(f"### ❌ {path} - ERROR: {data['error']}")
                continue
                
            status_icons = []
            status_icons.append("✅" if data.get("has_tiation_link") else "❌")
            status_icons.append("🏢" if data.get("has_enterprise_mention") else "⚪")
            status_icons.append("🌟" if data.get("has_ngo_mention") else "⚪")
            status_icons.append("📄" if data.get("has_footer_section") else "⚪")
            
            report.append(f"### {' '.join(status_icons)} {path}")
            report.append(f"- Tiation Link: {'✅' if data.get('has_tiation_link') else '❌'}")
            report.append(f"- Enterprise Grade: {'✅' if data.get('has_enterprise_mention') else '❌'}")
            report.append(f"- NGO Mission: {'✅' if data.get('has_ngo_mention') else '❌'}")
            report.append(f"- Footer Section: {'✅' if data.get('has_footer_section') else '❌'}")
            report.append("")
    
    return "\n".join(report)

def main():
    """Main execution function"""
    base_path = "/Users/tiaastor/Github/tiation-repos"
    
    print("🔍 Validating README footers across all repositories...")
    results = validate_all_footers(base_path)
    
    print("📊 Generating validation report...")
    report = generate_report(results)
    
    # Save results
    with open("/Users/tiaastor/Github/tiation-repos/footer_validation_report.md", "w", encoding="utf-8") as f:
        f.write(report)
    
    with open("/Users/tiaastor/Github/tiation-repos/footer_validation_data.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    
    print("✅ Validation complete!")
    print(f"📄 Report saved to: footer_validation_report.md")
    print(f"📊 Data saved to: footer_validation_data.json")
    
    # Print quick summary
    total_files = len(results)
    files_with_tiation_link = sum(1 for r in results.values() if r.get("has_tiation_link", False))
    print(f"\n📈 Quick Summary:")
    print(f"   - Total files: {total_files}")
    print(f"   - Files with tiation.github.io: {files_with_tiation_link}")
    print(f"   - Coverage: {files_with_tiation_link/total_files*100:.1f}%")

if __name__ == "__main__":
    main()
