# Contributing Guide

Welcome to the Fashion E-Commerce project! This guide will help you contribute effectively.

## 🎯 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Report issues privately if they're sensitive
- Help others in the community

## 🚀 Getting Started

### 1. Fork Repository
```bash
# Click "Fork" on GitHub
```

### 2. Clone Your Fork
```bash
git clone https://github.com/your-username/fashion-ecommerce.git
cd fashion-ecommerce
```

### 3. Add Upstream Remote
```bash
git remote add upstream https://github.com/original-owner/fashion-ecommerce.git
```

### 4. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

## 📝 Development Workflow

### Backend Development

**Code Organization:**
```
backend/
├── src/main/java/com/fashion/ecommerce/
│   ├── controller/       # REST endpoints
│   ├── service/         # Business logic
│   ├── repository/      # Data access
│   ├── entity/          # JPA models
│   ├── dto/             # Data transfer objects
│   ├── exception/       # Custom exceptions
│   ├── security/        # JWT & Auth
│   ├── config/          # Configurations
│   └── util/            # Utilities
└── src/test/java/       # Unit tests
```

**Naming Conventions:**
```
- Controllers: *Controller (e.g., ProductController)
- Services: *Service (e.g., ProductService)
- Repositories: *Repository (e.g., ProductRepository)
- Entities: PascalCase (e.g., Product, Order)
- DTOs: *DTO (e.g., ProductDTO)
```

**Code Style:**
```java
// Use Java naming conventions
@GetMapping("/products")
public ResponseEntity<ApiResponse<List<ProductDTO>>> getAllProducts() {
    // Implementation
}

// Add documentation
/**
 * Retrieves all products with pagination
 * @param page Page number (0-indexed)
 * @return List of products
 */
```

### Frontend Development

**Code Organization:**
```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── api/            # API service layer
│   ├── context/        # State management
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript interfaces
│   ├── utils/          # Utility functions
│   └── styles/         # Global styles
```

**Naming Conventions:**
```typescript
// PascalCase for components
export function ProductCard(props: ProductProps) {
  return <div>...</div>;
}

// camelCase for hooks and utilities
export const useFetchProducts = () => {
  // Implementation
};

// UPPER_SNAKE_CASE for constants
const FEATURED_PRODUCTS_COUNT = 8;
```

**Code Style:**
```typescript
// Use TypeScript strict mode
interface Product {
  id: number;
  name: string;
  price: number;
}

// Add JSDoc comments
/**
 * Displays a product card with image and details
 * @param product - Product data
 * @param onAddToCart - Callback when add to cart clicked
 */
export function ProductCard({ product, onAddToCart }: Props) {
  return <div>...</div>;
}
```

## 🧪 Testing Requirements

### Backend Tests

**Unit Tests:**
```java
@SpringBootTest
public class ProductServiceTest {
    @Mock
    private ProductRepository productRepository;
    
    @InjectMocks
    private ProductService productService;
    
    @Test
    public void testGetProductById() {
        // Arrange
        Long productId = 1L;
        Product product = new Product();
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        
        // Act
        ProductDTO result = productService.getProductById(productId);
        
        // Assert
        assertNotNull(result);
        assertEquals(product.getId(), result.getId());
    }
}
```

**Run Tests:**
```bash
cd backend
mvn test

# With coverage
mvn test jacoco:report
```

### Frontend Tests

**Component Tests:**
```typescript
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('renders product name', () => {
    const product = {
      id: 1,
      name: 'Test Product',
      price: 99.99,
    };
    
    render(<ProductCard product={product} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
```

**Run Tests:**
```bash
cd frontend
npm test
```

**Coverage Requirement:**
- Minimum 70% code coverage
- 100% coverage for critical paths (auth, payments)

## 🎨 Git Workflow

### Branch Naming
```
feature/add-wishlist          # New feature
bugfix/fix-cart-overflow      # Bug fix
refactor/update-auth          # Code refactoring
docs/update-readme            # Documentation
test/add-product-tests        # Test additions
```

### Commit Messages
```
# Good commit message
feat: Add wishlist functionality
- Create WishlistService with add/remove operations
- Add wishlist endpoints to WishlistController
- Update ProductCard with heart button

# Bad commit message
fixed stuff
update code
```

**Format:**
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `style`: Code style changes
- `test`: Test additions
- `docs`: Documentation changes
- `chore`: Build/dependency updates

### Pull Request Process

**1. Update Your Branch**
```bash
git fetch upstream
git rebase upstream/main
```

**2. Push Changes**
```bash
git push origin feature/your-feature
```

**3. Create Pull Request**
- Go to GitHub
- Click "Compare & pull request"
- Fill in description and linked issues

**4. PR Template**
```markdown
## Description
Brief description of changes

## Motivation
Why these changes are needed

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🔍 Code Review Guidelines

### What Reviewers Look For

**Code Quality:**
- ✅ Follows project conventions
- ✅ No code duplication
- ✅ Proper error handling
- ✅ TypeScript strict mode (frontend)
- ✅ Java best practices (backend)

**Performance:**
- ✅ Database queries optimized
- ✅ No N+1 queries
- ✅ Caching where appropriate
- ✅ Lazy loading implemented

**Security:**
- ✅ No hardcoded secrets
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection

**Testing:**
- ✅ Unit tests included
- ✅ Edge cases covered
- ✅ Tests pass locally

### Requesting Review

```bash
# Add reviewer to PR
# GitHub will automatically notify them

# In your code, comment for context
@reviewer This is tricky because...
```

## 📚 Documentation

### Update README
- Link to your feature
- Add examples if applicable
- Update table of contents

### Add Comments
```java
// A good comment explains WHY, not WHAT
// Bad:
int x = 5;  // Set x to 5

// Good:
// Maximum items per page to prevent memory overflow
int MAX_PAGE_SIZE = 5;
```

### Update Changelog
```markdown
## [Unreleased]
### Added
- Wishlist functionality (PR #123)
- Email notifications (PR #124)

### Fixed
- Cart item duplication bug (PR #125)
```

## 🐛 Bug Reports

**Good Bug Report Format:**
```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Go to products page
2. Filter by price
3. Notice items not showing

## Expected Behavior
Products should display

## Actual Behavior
No products shown

## Screenshots
[Attach screenshot]

## Environment
- OS: Windows 11
- Browser: Chrome 120
- Backend version: 1.0.0
```

## 💡 Feature Requests

**Good Feature Request Format:**
```markdown
## Feature Description
What functionality is needed?

## Use Case
Why is this needed?

## Implementation Ideas
How could this be done?

## Related Issues
Link to related issues
```

## 🚨 Common Mistakes

### Don't
- ❌ Commit node_modules or target/
- ❌ Hard code configuration values
- ❌ Commit passwords or API keys
- ❌ Mix multiple features in one PR
- ❌ Force push to main
- ❌ Ignore test failures

### Do
- ✅ Use .gitignore properly
- ✅ Use environment variables
- ✅ Keep commits focused
- ✅ Write descriptive commit messages
- ✅ Run tests before pushing
- ✅ Ask for help if stuck

## 🔄 Keeping Your Fork Updated

```bash
# Fetch latest changes
git fetch upstream

# Rebase on latest main
git rebase upstream/main

# Force push to your fork
git push -f origin main
```

## 📦 Release Process

### Version Numbering
- `1.0.0` = major.minor.patch
- `1.1.0` = Minor feature release
- `1.0.1` = Patch/bug fix release
- `2.0.0` = Major breaking changes

### Release Checklist
- [ ] Update version in pom.xml and package.json
- [ ] Update CHANGELOG.md
- [ ] Run full test suite
- [ ] Create release branch
- [ ] Tag release on GitHub
- [ ] Create release notes

## 🎓 Learning Resources

### Backend
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [JPA/Hibernate](https://hibernate.org/)
- [JWT Authentication](https://jwt.io/introduction)

### Frontend
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)

## 💬 Getting Help

- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions
- **Email**: contact@fashioneco.com
- **Discord**: Join our community server

## 🙏 Acknowledgments

Thank you for contributing! Your efforts make this project better.

---

**Happy contributing! 🚀**
