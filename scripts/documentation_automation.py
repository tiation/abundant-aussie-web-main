#!/usr/bin/env python3
"""
Documentation Enhancement Automation Script
ChaseWhiteRabbit NGO - Rigger Ecosystem

This script automates documentation monitoring, enhancement, and quality checks
across all Rigger repositories. Designed for deployment on VPS infrastructure.

Author: Rigger DevOps Team
Contact: tiatheone@protonmail.com, garrett@sxc.codes
"""

import os
import sys
import json
import subprocess
import logging
import argparse
import ast
import re
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from datetime import datetime
import requests
from dataclasses import dataclass

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/documentation_automation.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class DocumentationStats:
    """Documentation statistics for a repository."""
    repo_name: str
    total_functions: int
    documented_functions: int
    total_classes: int
    documented_classes: int
    readme_score: int
    api_docs_present: bool
    last_updated: str

class RiggerDocumentationAnalyzer:
    """Analyzes and enhances documentation across Rigger repositories."""
    
    def __init__(self, base_path: str = "/Users/tiaastor/Github/tiation-repos"):
        self.base_path = Path(base_path)
        self.repos = [
            "RiggerBackend",
            "RiggerShared", 
            "RiggerConnect-web",
            "RiggerHub-web",
            "RiggerConnect-android",
            "RiggerConnect-ios",
            "RiggerHub-android",
            "RiggerHub-ios"
        ]
        self.vps_config = {
            "grafana": "153.92.214.1",
            "gitlab": "145.223.22.10",
            "helm": "145.223.21.248"
        }
    
    def analyze_python_files(self, repo_path: Path) -> Tuple[int, int, int, int]:
        """Analyze Python files for documentation coverage."""
        total_functions = 0
        documented_functions = 0
        total_classes = 0
        documented_classes = 0
        
        for py_file in repo_path.rglob("*.py"):
            if "venv" in str(py_file) or "__pycache__" in str(py_file):
                continue
                
            try:
                with open(py_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    tree = ast.parse(content)
                    
                for node in ast.walk(tree):
                    if isinstance(node, ast.FunctionDef):
                        total_functions += 1
                        if ast.get_docstring(node):
                            documented_functions += 1
                    elif isinstance(node, ast.ClassDef):
                        total_classes += 1
                        if ast.get_docstring(node):
                            documented_classes += 1
                            
            except Exception as e:
                logger.warning(f"Error analyzing {py_file}: {e}")
                
        return total_functions, documented_functions, total_classes, documented_classes
    
    def analyze_javascript_files(self, repo_path: Path) -> Tuple[int, int]:
        """Analyze JavaScript/TypeScript files for documentation coverage."""
        total_functions = 0
        documented_functions = 0
        
        patterns = ["*.js", "*.ts", "*.jsx", "*.tsx"]
        for pattern in patterns:
            for js_file in repo_path.rglob(pattern):
                if "node_modules" in str(js_file) or "build" in str(js_file):
                    continue
                    
                try:
                    with open(js_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # Simple regex patterns for function detection
                    function_patterns = [
                        r'function\s+\w+\s*\(',
                        r'const\s+\w+\s*=\s*\(',
                        r'export\s+function\s+\w+\s*\(',
                        r'\w+\s*:\s*function\s*\(',
                        r'\w+\s*:\s*\([^)]*\)\s*=>'
                    ]
                    
                    for pattern in function_patterns:
                        matches = re.findall(pattern, content)
                        total_functions += len(matches)
                        
                    # Check for JSDoc comments
                    jsdoc_pattern = r'/\*\*[\s\S]*?\*/'
                    documented_functions += len(re.findall(jsdoc_pattern, content))
                    
                except Exception as e:
                    logger.warning(f"Error analyzing {js_file}: {e}")
                    
        return total_functions, min(documented_functions, total_functions)
    
    def analyze_readme_quality(self, repo_path: Path) -> int:
        """Analyze README quality and completeness."""
        readme_files = list(repo_path.glob("README*"))
        if not readme_files:
            return 0
            
        readme_path = readme_files[0]
        try:
            with open(readme_path, 'r', encoding='utf-8') as f:
                content = f.read().lower()
                
            # Check for essential sections
            essential_sections = [
                "overview", "installation", "usage", "api", 
                "configuration", "contributing", "license"
            ]
            
            score = 0
            for section in essential_sections:
                if section in content:
                    score += 1
                    
            # Bonus points for examples, images, badges
            if "example" in content or "```" in content:
                score += 1
            if "![" in content or "https://img.shields.io" in content:
                score += 1
                
            return min(score * 10, 100)  # Convert to percentage
            
        except Exception as e:
            logger.warning(f"Error analyzing README in {repo_path}: {e}")
            return 0
    
    def check_api_documentation(self, repo_path: Path) -> bool:
        """Check if API documentation exists."""
        api_indicators = [
            "docs/api", "api.md", "swagger", "openapi", 
            "postman", "api-reference"
        ]
        
        for indicator in api_indicators:
            if list(repo_path.rglob(f"*{indicator}*")):
                return True
        return False
    
    def analyze_repository(self, repo_name: str) -> Optional[DocumentationStats]:
        """Analyze a single repository for documentation quality."""
        repo_path = self.base_path / repo_name
        
        if not repo_path.exists():
            logger.warning(f"Repository {repo_name} not found at {repo_path}")
            return None
            
        logger.info(f"Analyzing repository: {repo_name}")
        
        # Determine repository type and analyze accordingly
        total_functions = 0
        documented_functions = 0
        total_classes = 0
        documented_classes = 0
        
        if any(repo_path.rglob("*.py")):
            # Python repository
            total_functions, documented_functions, total_classes, documented_classes = \
                self.analyze_python_files(repo_path)
        elif any(repo_path.rglob("*.js")) or any(repo_path.rglob("*.ts")):
            # JavaScript/TypeScript repository
            total_functions, documented_functions = self.analyze_javascript_files(repo_path)
        
        readme_score = self.analyze_readme_quality(repo_path)
        api_docs_present = self.check_api_documentation(repo_path)
        
        return DocumentationStats(
            repo_name=repo_name,
            total_functions=total_functions,
            documented_functions=documented_functions,
            total_classes=total_classes,
            documented_classes=documented_classes,
            readme_score=readme_score,
            api_docs_present=api_docs_present,
            last_updated=datetime.now().isoformat()
        )
    
    def generate_documentation_report(self, stats_list: List[DocumentationStats]) -> Dict:
        """Generate comprehensive documentation report."""
        report = {
            "generated_at": datetime.now().isoformat(),
            "total_repositories": len(stats_list),
            "repositories": []
        }
        
        total_functions = 0
        total_documented_functions = 0
        
        for stats in stats_list:
            if stats:
                repo_data = {
                    "name": stats.repo_name,
                    "documentation_coverage": {
                        "functions": {
                            "total": stats.total_functions,
                            "documented": stats.documented_functions,
                            "percentage": (stats.documented_functions / max(stats.total_functions, 1)) * 100
                        },
                        "classes": {
                            "total": stats.total_classes,
                            "documented": stats.documented_classes,
                            "percentage": (stats.documented_classes / max(stats.total_classes, 1)) * 100
                        }
                    },
                    "readme_score": stats.readme_score,
                    "api_documentation": stats.api_docs_present,
                    "overall_score": self.calculate_overall_score(stats),
                    "last_updated": stats.last_updated
                }
                
                report["repositories"].append(repo_data)
                total_functions += stats.total_functions
                total_documented_functions += stats.documented_functions
        
        # Calculate ecosystem-wide metrics
        report["ecosystem_metrics"] = {
            "overall_documentation_coverage": (total_documented_functions / max(total_functions, 1)) * 100,
            "repositories_with_api_docs": sum(1 for s in stats_list if s and s.api_docs_present),
            "average_readme_score": sum(s.readme_score for s in stats_list if s) / len([s for s in stats_list if s])
        }
        
        return report
    
    def calculate_overall_score(self, stats: DocumentationStats) -> int:
        """Calculate overall documentation score for a repository."""
        function_score = (stats.documented_functions / max(stats.total_functions, 1)) * 40
        class_score = (stats.documented_classes / max(stats.total_classes, 1)) * 20
        readme_score = stats.readme_score * 0.3
        api_score = 10 if stats.api_docs_present else 0
        
        return int(function_score + class_score + readme_score + api_score)
    
    def send_to_grafana(self, report: Dict):
        """Send metrics to Grafana dashboard."""
        try:
            grafana_url = f"http://{self.vps_config['grafana']}:3000/api/annotations"
            
            for repo in report["repositories"]:
                payload = {
                    "text": f"Documentation Update: {repo['name']}",
                    "tags": ["documentation", "rigger", repo["name"]],
                    "time": int(datetime.now().timestamp() * 1000),
                    "data": {
                        "overall_score": repo["overall_score"],
                        "function_coverage": repo["documentation_coverage"]["functions"]["percentage"],
                        "readme_score": repo["readme_score"]
                    }
                }
                
                # Note: In production, use proper authentication
                headers = {"Content-Type": "application/json"}
                response = requests.post(grafana_url, json=payload, headers=headers, timeout=10)
                
                if response.status_code == 200:
                    logger.info(f"Successfully sent metrics for {repo['name']} to Grafana")
                else:
                    logger.warning(f"Failed to send metrics for {repo['name']}: {response.status_code}")
                    
        except Exception as e:
            logger.error(f"Error sending metrics to Grafana: {e}")
    
    def generate_improvement_suggestions(self, stats: DocumentationStats) -> List[str]:
        """Generate specific improvement suggestions for a repository."""
        suggestions = []
        
        function_coverage = (stats.documented_functions / max(stats.total_functions, 1)) * 100
        if function_coverage < 80:
            suggestions.append(f"Add docstrings to {stats.total_functions - stats.documented_functions} undocumented functions")
        
        if stats.total_classes > 0:
            class_coverage = (stats.documented_classes / stats.total_classes) * 100
            if class_coverage < 90:
                suggestions.append(f"Add docstrings to {stats.total_classes - stats.documented_classes} undocumented classes")
        
        if stats.readme_score < 70:
            suggestions.append("Improve README with missing sections: installation, usage, examples")
        
        if not stats.api_docs_present and "Backend" in stats.repo_name:
            suggestions.append("Add comprehensive API documentation (Swagger/OpenAPI)")
        
        if stats.readme_score < 50:
            suggestions.append("README needs major overhaul - consider using the standard template")
        
        return suggestions
    
    def create_github_issues(self, stats_list: List[DocumentationStats]):
        """Create GitHub issues for documentation improvements."""
        for stats in stats_list:
            if not stats:
                continue
                
            suggestions = self.generate_improvement_suggestions(stats)
            if not suggestions:
                continue
                
            issue_title = f"Documentation Enhancement - {stats.repo_name}"
            issue_body = f"""
# Documentation Enhancement Required

## Current Status
- **Function Documentation Coverage:** {(stats.documented_functions / max(stats.total_functions, 1)) * 100:.1f}%
- **Class Documentation Coverage:** {(stats.documented_classes / max(stats.total_classes, 1)) * 100:.1f}%
- **README Score:** {stats.readme_score}/100
- **API Documentation:** {'✅' if stats.api_docs_present else '❌'}

## Suggested Improvements
{''.join(f'- {suggestion}' for suggestion in suggestions)}

## Resources
- [Documentation Templates](../docs/standards/Documentation_Templates.md)
- [Enhancement Roadmap](../DOCUMENTATION_ENHANCEMENT_ROADMAP.md)

**Priority:** {'High' if stats.calculate_overall_score() < 60 else 'Medium'}
**Assignee:** Documentation Team
**Labels:** documentation, enhancement, {'high-priority' if len(suggestions) > 3 else 'medium-priority'}

---
*Auto-generated by Documentation Enhancement System*
*Last Updated: {stats.last_updated}*
            """
            
            logger.info(f"Would create issue for {stats.repo_name}: {issue_title}")
            # In production, this would use GitHub API to create actual issues
    
    def run_analysis(self, create_issues: bool = False, send_metrics: bool = False):
        """Run complete documentation analysis."""
        logger.info("Starting documentation analysis for Rigger ecosystem")
        
        stats_list = []
        for repo_name in self.repos:
            stats = self.analyze_repository(repo_name)
            if stats:
                stats_list.append(stats)
        
        # Generate comprehensive report
        report = self.generate_documentation_report(stats_list)
        
        # Save report to file
        report_path = self.base_path / "docs" / "reports" / f"documentation_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        report_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"Documentation report saved to {report_path}")
        
        # Print summary
        print(f"\n📊 Documentation Analysis Summary")
        print(f"{'='*50}")
        print(f"Total Repositories Analyzed: {report['total_repositories']}")
        print(f"Overall Documentation Coverage: {report['ecosystem_metrics']['overall_documentation_coverage']:.1f}%")
        print(f"Repositories with API Docs: {report['ecosystem_metrics']['repositories_with_api_docs']}")
        print(f"Average README Score: {report['ecosystem_metrics']['average_readme_score']:.1f}/100")
        
        print(f"\n📋 Repository Details:")
        for repo_data in report["repositories"]:
            print(f"\n{repo_data['name']}:")
            print(f"  Overall Score: {repo_data['overall_score']}/100")
            print(f"  Function Coverage: {repo_data['documentation_coverage']['functions']['percentage']:.1f}%")
            print(f"  README Score: {repo_data['readme_score']}/100")
            print(f"  API Docs: {'✅' if repo_data['api_documentation'] else '❌'}")
        
        # Optional integrations
        if send_metrics:
            self.send_to_grafana(report)
        
        if create_issues:
            self.create_github_issues(stats_list)
        
        return report

def main():
    """Main entry point for the documentation automation script."""
    parser = argparse.ArgumentParser(description="Rigger Documentation Enhancement Automation")
    parser.add_argument("--base-path", default="/Users/tiaastor/Github/tiation-repos",
                       help="Base path to Rigger repositories")
    parser.add_argument("--create-issues", action="store_true",
                       help="Create GitHub issues for improvements")
    parser.add_argument("--send-metrics", action="store_true",
                       help="Send metrics to Grafana dashboard")
    parser.add_argument("--verbose", "-v", action="store_true",
                       help="Enable verbose logging")
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    analyzer = RiggerDocumentationAnalyzer(args.base_path)
    
    try:
        report = analyzer.run_analysis(
            create_issues=args.create_issues,
            send_metrics=args.send_metrics
        )
        
        logger.info("Documentation analysis completed successfully")
        return 0
        
    except Exception as e:
        logger.error(f"Documentation analysis failed: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
