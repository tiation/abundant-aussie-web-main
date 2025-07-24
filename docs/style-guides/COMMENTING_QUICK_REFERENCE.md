# Inline Commenting Quick Reference

## Language-Specific Comment Syntax

| Language   | Single-line | Multi-line | Documentation |
|------------|------------|------------|---------------|
| JavaScript | `//`       | `/* */`    | `/** */` (JSDoc) |
| TypeScript | `//`       | `/* */`    | `/** */` (TSDoc) |
| Swift      | `//`       | `/* */`    | `/** */` or `///` |
| Python     | `#`        | `""" """`  | `""" """` (docstring) |
| Go         | `//`       | `/* */`    | `//` (package/func docs) |
| Java       | `//`       | `/* */`    | `/** */` (Javadoc) |

## Comment Priority Matrix

### High Priority (Always Comment)
- [ ] Complex algorithms and data structures
- [ ] Business logic and domain rules
- [ ] Security-sensitive operations
- [ ] Performance optimizations
- [ ] External API integrations
- [ ] Workarounds and temporary fixes

### Medium Priority (Comment When Helpful)
- [ ] Configuration and setup code
- [ ] Error handling strategies
- [ ] Design pattern implementations
- [ ] Non-obvious side effects
- [ ] Resource management

### Low Priority (Usually Don't Comment)
- [ ] Self-explanatory variable assignments
- [ ] Standard language constructs
- [ ] Obvious function calls
- [ ] Simple getters/setters

## Documentation Comment Templates

### Function/Method Documentation
```
/**
 * [Brief description of what the function does]
 * 
 * [Optional: More detailed explanation if needed]
 * 
 * @param {type} paramName - Description of parameter
 * @returns {type} Description of return value
 * @throws {ExceptionType} When this exception is thrown
 * 
 * @example
 * const result = functionName(arg1, arg2);
 * // Expected output or behavior
 */
```

### Class Documentation
```
/**
 * [Brief description of the class purpose]
 * 
 * [Detailed explanation of design decisions, usage patterns,
 *  and important considerations]
 * 
 * @author [Author name]
 * @version [Version number]
 * @since [Version when class was introduced]
 */
```

### Algorithm Documentation
```
/*
 * Algorithm: [Name]
 * Time: O(n), Space: O(1)
 * 
 * Why this approach:
 * - [Reason 1]
 * - [Reason 2]
 * 
 * Alternatives considered:
 * - [Alternative]: [Why rejected]
 */
```

## Comment Quality Checklist

### Before Writing Comments
- [ ] Is the code self-explanatory? (If yes, consider refactoring instead)
- [ ] Am I explaining WHY, not just WHAT?
- [ ] Will this help future developers (including myself)?
- [ ] Is this information that can't be derived from the code itself?

### After Writing Comments
- [ ] Comments are up-to-date with the code
- [ ] Language is clear and concise
- [ ] No spelling or grammar errors
- [ ] Follows language-specific conventions
- [ ] Examples are accurate and helpful

## Common Anti-Patterns to Avoid

### ❌ Redundant Comments
```javascript
// Increment counter by 1
counter++; // Bad: Comment adds no value
```

### ❌ Obvious Comments
```python
# Set username to "admin"
username = "admin"  # Bad: Code is self-explanatory
```

### ❌ Outdated Comments
```java
// Returns user data as XML
public String getUserData() {
    return JsonUtils.toJson(userData); // Bad: Comment doesn't match code
}
```

### ❌ Commented-out Code
```swift
// func oldImplementation() {
//     // Old code that should be removed
// }
```

## Best Practice Examples

### ✅ Explaining Business Logic
```javascript
// Apply bulk discount for orders over $500 (company policy)
const discount = orderTotal > 500 ? 0.10 : 0;
```

### ✅ Algorithm Explanation
```python
# Use binary search to find insertion point
# Maintains sorted order with O(log n) complexity
left, right = 0, len(arr)
while left < right:
    mid = (left + right) // 2
    if arr[mid] < value:
        left = mid + 1
    else:
        right = mid
```

### ✅ Security Context
```go
// Validate JWT signature to prevent token tampering
// Uses constant-time comparison to prevent timing attacks
if !hmac.Equal(signature, expectedSignature) {
    return ErrInvalidToken
}
```

### ✅ Performance Notes
```swift
// Cache expensive calculation result for 5-minute intervals
// Reduces API calls from ~1000/min to ~1/5min under normal load
if cacheAge > 300 || cachedResult == nil {
    cachedResult = performExpensiveCalculation()
    cacheTimestamp = Date()
}
```

## IDE Integration Tips

### VS Code
- Install language-specific documentation extensions
- Configure auto-comment templates
- Enable spell-check for comments

### IntelliJ/WebStorm
- Use Live Templates for comment snippets
- Enable documentation generation tools
- Configure code inspection for missing docs

### Xcode
- Use Quick Help markup for Swift documentation
- Enable documentation comments in preferences
- Generate documentation with Xcode's built-in tools

## Team Implementation Strategy

### Phase 1: Foundation (Week 1-2)
- [ ] Distribute standards documentation
- [ ] Set up IDE configurations
- [ ] Create comment templates for common patterns

### Phase 2: Integration (Week 3-4)
- [ ] Add documentation checks to CI/CD pipeline
- [ ] Conduct code review training sessions
- [ ] Update existing critical code sections

### Phase 3: Enforcement (Ongoing)
- [ ] Make documentation part of Definition of Done
- [ ] Regular team reviews of comment quality
- [ ] Update standards based on team feedback

---

*Quick reference for the comprehensive INLINE_COMMENTING_STANDARDS.md guide*
