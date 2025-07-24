# Inline Commenting Standards

## Overview
This document establishes unified standards for inline comments across multiple programming languages (JavaScript, TypeScript, Swift, Python, Go, Java), ensuring code readability, maintainability, and knowledge transfer.

## General Principles

### When to Comment
- **Algorithm explanations**: Complex logic that isn't immediately obvious
- **Business logic**: Domain-specific rules and constraints
- **Performance considerations**: Optimizations and trade-offs
- **Workarounds**: Temporary fixes with context for future improvements
- **External dependencies**: Third-party integrations and APIs
- **Security considerations**: Authentication, authorization, and data protection

### When NOT to Comment
- Obvious code that explains itself
- Redundant descriptions of what code does (focus on WHY)
- Outdated comments that no longer match the code
- Comments that repeat variable or function names

### Comment Quality Standards
- Write comments for future developers (including yourself)
- Use clear, concise language aligned with DOCUMENTATION_STANDARDS.md
- Keep comments up-to-date with code changes
- Explain the reasoning behind decisions, not just the implementation

## Language-Specific Standards

### JavaScript & TypeScript

#### Single-line Comments
```javascript
// Use for brief explanations and quick notes
const apiKey = process.env.API_KEY; // Retrieved from environment for security

// Explain complex business logic
const discountRate = customerTier === 'premium' ? 0.15 : 0.05; // Premium customers get 15% discount
```

#### Multi-line Comments
```javascript
/*
 * Use JSDoc format for functions and classes
 * Provide parameter and return type information
 * Include usage examples when helpful
 */

/**
 * Calculates compound interest with monthly compounding
 * 
 * @param {number} principal - Initial investment amount
 * @param {number} rate - Annual interest rate (as decimal, e.g., 0.05 for 5%)
 * @param {number} years - Investment period in years
 * @returns {number} Final amount after compound interest
 * 
 * @example
 * const result = calculateCompoundInterest(1000, 0.05, 10);
 * // Returns: 1647.01
 */
function calculateCompoundInterest(principal, rate, years) {
    // Monthly compounding formula: A = P(1 + r/12)^(12t)
    return principal * Math.pow(1 + rate / 12, 12 * years);
}
```

#### TypeScript-Specific
```typescript
// Use type annotations to reduce need for comments
interface UserPreferences {
    theme: 'light' | 'dark';
    notifications: boolean;
    // Stored in UTC, converted to local time on display
    timezone: string;
}

// Explain type constraints and business rules
type UserId = string; // UUID format required for database consistency
```

### Swift

#### Single-line Comments
```swift
// Use for quick explanations and clarifications
let maxRetries = 3 // Network requests retry limit per Apple guidelines

// Explain iOS-specific considerations
@available(iOS 13.0, *) // Required for SwiftUI compatibility
func updateUI() {
    // Implementation here
}
```

#### Documentation Comments
```swift
/**
 * Authenticates user with biometric data
 * 
 * Uses Touch ID or Face ID depending on device capabilities.
 * Falls back to passcode if biometric authentication fails.
 * 
 * - Parameters:
 *   - reason: User-facing explanation for authentication request
 *   - completion: Callback with authentication result
 * 
 * - Returns: Void (result passed to completion handler)
 * 
 * - Important: Must be called on main thread for UI updates
 */
func authenticateWithBiometrics(reason: String, completion: @escaping (Bool) -> Void) {
    // Implementation follows Apple's LocalAuthentication guidelines
}
```

#### MARK Comments for Organization
```swift
// MARK: - View Lifecycle
override func viewDidLoad() {
    super.viewDidLoad()
    // Setup code here
}

// MARK: - Data Management
private func saveUserData() {
    // Core Data operations with error handling
}

// MARK: - Network Requests
private func fetchUserProfile() {
    // Async network call with proper error handling
}
```

### Python

#### Single-line Comments
```python
# Use for brief explanations and context
max_connections = 100  # Database connection pool limit

# Explain algorithm choices
items.sort(key=lambda x: x.priority, reverse=True)  # Highest priority first
```

#### Docstrings (Multi-line Documentation)
```python
def calculate_tax(income, filing_status='single', year=2024):
    """
    Calculate federal income tax based on current tax brackets.
    
    This function implements the progressive tax system with standard
    deductions applied automatically based on filing status.
    
    Args:
        income (float): Gross annual income in USD
        filing_status (str): Tax filing status ('single', 'married_joint', 'married_separate')
        year (int): Tax year for bracket calculation (default: current year)
    
    Returns:
        dict: Contains 'tax_owed', 'effective_rate', and 'marginal_rate'
    
    Raises:
        ValueError: If income is negative or filing_status is invalid
        
    Example:
        >>> result = calculate_tax(75000, 'single')
        >>> print(f"Tax owed: ${result['tax_owed']:.2f}")
        Tax owed: $12345.67
        
    Note:
        Tax brackets are updated annually. Verify current rates before
        using for actual tax calculations.
    """
    # Input validation with clear error messages
    if income < 0:
        raise ValueError("Income cannot be negative")
```

#### Type Hints with Comments
```python
from typing import List, Dict, Optional

def process_user_data(
    users: List[Dict[str, any]], 
    filters: Optional[Dict[str, str]] = None
) -> List[Dict[str, any]]:
    """Process user data with optional filtering."""
    # Type hints reduce need for parameter documentation
    # Focus comments on business logic instead
```

### Go

#### Single-line Comments
```go
// Use for quick explanations and context
const maxRetries = 3 // Network operation retry limit

// Explain Go-specific patterns
defer file.Close() // Ensures cleanup even if function panics
```

#### Package and Function Documentation
```go
// Package userauth provides authentication and authorization utilities
// for web applications with support for JWT tokens and role-based access.
//
// Example usage:
//   auth := userauth.New(secretKey)
//   token, err := auth.GenerateToken(userID, roles)
package userauth

// GenerateJWT creates a signed JWT token with user claims.
//
// The token includes standard claims (exp, iat, iss) and custom
// claims for user ID and roles. Expires in 24 hours by default.
//
// Parameters:
//   userID: Unique identifier for the authenticated user
//   roles: Slice of role strings for authorization
//
// Returns the signed token string and any error encountered.
func GenerateJWT(userID string, roles []string) (string, error) {
    // JWT implementation with proper error handling
    // Uses RS256 algorithm for enhanced security
}
```

#### Error Handling Comments
```go
func connectDatabase() (*sql.DB, error) {
    // Attempt connection with exponential backoff
    for attempt := 1; attempt <= maxRetries; attempt++ {
        db, err := sql.Open("postgres", connectionString)
        if err != nil {
            // Log error but continue retrying for transient issues
            log.Printf("Database connection attempt %d failed: %v", attempt, err)
            continue
        }
        return db, nil
    }
    
    // All retry attempts exhausted
    return nil, fmt.Errorf("failed to connect after %d attempts", maxRetries)
}
```

### Java

#### Single-line Comments
```java
// Use for brief explanations and context
private static final int MAX_CONNECTIONS = 100; // Connection pool limit

// Explain Java-specific considerations
@Override // Explicitly mark method overrides for clarity
public String toString() {
    // Implementation here
}
```

#### Javadoc Comments
```java
/**
 * Manages user session data with automatic cleanup and security features.
 * 
 * <p>This class provides thread-safe session management with configurable
 * timeout periods and automatic cleanup of expired sessions. All session
 * data is encrypted using AES-256 before storage.
 * 
 * @author Development Team
 * @version 2.1.0
 * @since 1.0.0
 * 
 * @see UserAuthentication
 * @see SecurityConfig
 */
public class SessionManager {
    
    /**
     * Creates a new user session with specified timeout.
     * 
     * <p>Session IDs are generated using cryptographically secure random
     * number generation to prevent session hijacking attacks.
     * 
     * @param userId the unique identifier for the user
     * @param timeoutMinutes session timeout in minutes (default: 30)
     * @return newly created session instance
     * @throws IllegalArgumentException if userId is null or empty
     * @throws SecurityException if session creation fails security checks
     * 
     * @implNote Sessions are stored in memory with automatic cleanup
     * @since 1.0.0
     */
    public Session createSession(String userId, int timeoutMinutes) {
        // Input validation with detailed error messages
        if (userId == null || userId.trim().isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }
        
        // Generate secure session ID using SecureRandom
        String sessionId = generateSecureSessionId();
        
        // Create session with automatic cleanup scheduling
        return new Session(sessionId, userId, timeoutMinutes);
    }
}
```

## Algorithm and Data Structure Documentation

### Algorithm Documentation Template
```
/*
 * Algorithm: [Name and brief description]
 * 
 * Purpose: [Why this algorithm was chosen]
 * Time Complexity: O(n) [with explanation]
 * Space Complexity: O(1) [with explanation]
 * 
 * Trade-offs:
 * - Pro: [Advantages of this approach]
 * - Con: [Limitations or disadvantages]
 * 
 * Alternative approaches considered:
 * - [Other options and why they were rejected]
 * 
 * References:
 * - [Academic papers, documentation, or resources]
 */
```

### Data Structure Documentation
```
/*
 * Data Structure: Custom HashMap Implementation
 * 
 * Design Decisions:
 * - Open addressing with linear probing for cache efficiency
 * - Load factor threshold of 0.75 to minimize collisions
 * - Dynamic resizing doubles capacity when threshold exceeded
 * 
 * Performance Characteristics:
 * - Average case: O(1) for insert, delete, lookup
 * - Worst case: O(n) when all keys hash to same bucket
 * 
 * Memory Layout:
 * - Contiguous array for better cache locality
 * - Tombstone markers for deleted entries
 * - Metadata stored separately to optimize access patterns
 */
```

### Complex Code Documentation Example
```javascript
/**
 * Implements distributed consensus using Raft algorithm
 * 
 * This is a simplified version focusing on leader election.
 * Full implementation would include log replication and safety properties.
 */
class RaftNode {
    constructor(nodeId, peers) {
        this.nodeId = nodeId;
        this.peers = peers;
        
        // Raft state variables (persistent)
        this.currentTerm = 0;        // Latest term server has seen
        this.votedFor = null;        // CandidateId that received vote in current term
        this.log = [];               // Log entries (simplified)
        
        // Raft state variables (volatile)
        this.commitIndex = 0;        // Index of highest log entry known to be committed
        this.lastApplied = 0;        // Index of highest log entry applied to state machine
        
        // State machine
        this.state = 'follower';     // 'follower', 'candidate', or 'leader'
        this.leaderId = null;        // Current leader (null if unknown)
        
        // Timing parameters (in milliseconds)
        this.electionTimeout = this.randomElectionTimeout();
        this.heartbeatInterval = 50; // Leader sends heartbeats every 50ms
        
        this.resetElectionTimer();
    }
    
    /**
     * Generates random election timeout to prevent split votes
     * 
     * Raft paper recommends 150-300ms range. Randomization ensures
     * that split votes are rare even with network partitions.
     */
    randomElectionTimeout() {
        return 150 + Math.random() * 150; // 150-300ms range
    }
}
```

## Best Practices Summary

### Do's
- ✅ Explain the "why" behind complex decisions
- ✅ Document assumptions and constraints
- ✅ Include examples for complex functions
- ✅ Update comments when code changes
- ✅ Use consistent formatting within each language
- ✅ Write comments at the appropriate level of detail
- ✅ Include performance implications when relevant

### Don'ts
- ❌ Don't comment obvious code
- ❌ Don't use comments to fix bad code (refactor instead)
- ❌ Don't leave outdated or misleading comments
- ❌ Don't over-comment simple operations
- ❌ Don't use comments for version control (use git)
- ❌ Don't include personal opinions or jokes in production code

### Code Review Checklist
- [ ] Comments explain WHY, not just WHAT
- [ ] All public APIs have documentation comments
- [ ] Complex algorithms include time/space complexity
- [ ] Comments follow language-specific conventions
- [ ] No outdated or misleading comments
- [ ] Examples provided for non-trivial functions
- [ ] Security-sensitive code is properly documented

## Integration with Development Workflow

### IDE Configuration
- Configure code formatting tools to preserve comment formatting
- Set up linters to enforce documentation standards
- Use IDE plugins for automatic documentation generation
- Enable spell-check for comments and documentation

### Continuous Integration
- Include documentation checks in CI pipeline
- Verify that public APIs have documentation
- Check for outdated TODO comments in production branches
- Generate documentation from code comments automatically

### Team Guidelines
- Make commenting standards part of onboarding process
- Regular code review sessions focusing on documentation quality
- Maintain shared glossary of domain-specific terms
- Encourage pair programming to improve comment quality

---

*This document aligns with the editorial standards defined in DOCUMENTATION_STANDARDS.md and should be reviewed regularly to ensure continued relevance and accuracy.*
