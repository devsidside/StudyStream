# Contributing to StudyConnect

Thank you for your interest in contributing to StudyConnect! This document provides guidelines and information for contributors.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge
We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

---

## Getting Started

### Prerequisites
- Node.js (v20.0.0 or higher)
- npm (v9.0.0 or higher)
- Git
- PostgreSQL (or Neon account)
- Supabase account

### Fork and Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/studyconnect.git
cd studyconnect

# Add upstream remote
git remote add upstream https://github.com/original/studyconnect.git
```

### Setup Development Environment
```bash
# Install dependencies
npm install

# Set up environment variables (see docs/SETUP.md)
cp .env.example .env.local

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

---

## Development Workflow

### Branch Strategy
We use a simplified Git flow:

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: New features (`feature/user-authentication`)
- **fix/**: Bug fixes (`fix/supabase-connection`)
- **docs/**: Documentation updates (`docs/api-reference`)

### Creating a Feature Branch
```bash
# Update your main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Work on your feature
# ... make changes ...

# Commit your changes
git add .
git commit -m "feat(scope): add new feature"

# Push to your fork
git push origin feature/your-feature-name
```

### Keeping Your Fork Updated
```bash
# Fetch upstream changes
git fetch upstream

# Update main branch
git checkout main
git merge upstream/main

# Update your feature branch
git checkout feature/your-feature-name
git rebase main
```

---

## Coding Standards

### TypeScript Guidelines
- Use strict TypeScript configuration
- Define explicit types for all function parameters and return values
- Use interfaces for object shapes
- Prefer `type` for unions and primitives

```typescript
// Good
interface UserProfile {
  id: string;
  email: string;
  role: 'student' | 'vendor' | 'admin';
}

function getUserProfile(userId: string): Promise<UserProfile | null> {
  // implementation
}

// Avoid
function getUser(id: any): any {
  // implementation
}
```

### React Component Guidelines
- Use functional components with hooks
- Implement proper error boundaries
- Use TypeScript for all props
- Follow component naming conventions

```typescript
// Good
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ children, variant = 'primary', onClick, disabled }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
      data-testid="button"
    >
      {children}
    </button>
  );
}
```

### CSS/Styling Guidelines
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use CSS variables for theming
- Implement dark mode support

```typescript
// Good
<div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
    Welcome
  </h2>
</div>

// Avoid inline styles unless absolutely necessary
<div style={{ width: '100%', padding: '24px' }}>
```

### Database Guidelines
- Use Drizzle ORM for all database operations
- Define proper relationships and constraints
- Implement proper indexing for performance
- Use transactions for data consistency

```typescript
// Good - Type-safe database operations
const newResource = await db.insert(resources).values({
  title: validatedData.title,
  description: validatedData.description,
  ownerId: userId,
  type: validatedData.type,
}).returning();

// Use transactions for multiple operations
await db.transaction(async (tx) => {
  const resource = await tx.insert(resources).values(resourceData).returning();
  await tx.insert(resourceTags).values(tagData);
});
```

### API Design Guidelines
- Follow RESTful conventions
- Use proper HTTP status codes
- Implement comprehensive error handling
- Validate all inputs with Zod schemas

```typescript
// Good API endpoint structure
app.get('/api/resources/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await resourceService.getById(id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    res.json({ resource });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

---

## Commit Guidelines

### Commit Message Format
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Examples
```bash
feat(auth): add Google OAuth integration
fix(ui): resolve mobile navigation overflow
docs(api): update authentication endpoint documentation
style(components): format button component with prettier
refactor(database): optimize user query performance
test(auth): add unit tests for login validation
chore(deps): update React to version 18.3.1
```

### Scope Guidelines
- **auth**: Authentication and authorization
- **ui**: User interface components
- **api**: Backend API endpoints
- **database**: Database schema and operations
- **docs**: Documentation
- **config**: Configuration files
- **deps**: Dependencies

---

## Pull Request Process

### Before Submitting
1. **Test your changes**: Ensure all tests pass
```bash
npm run check        # TypeScript compilation
npm test            # Unit tests
npm run build       # Production build
```

2. **Lint your code**: Follow coding standards
```bash
npm run lint        # ESLint
npm run format      # Prettier
```

3. **Update documentation**: If you've added features or changed APIs

### Pull Request Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Related Issues
Closes #(issue number)
```

### Review Process
1. **Automated Checks**: CI/CD pipeline runs tests and builds
2. **Code Review**: At least one maintainer reviews the code
3. **Testing**: Changes are tested in development environment
4. **Approval**: Maintainer approves and merges the PR

### Merge Requirements
- ✅ All CI checks pass
- ✅ At least one approval from maintainer
- ✅ No merge conflicts
- ✅ Documentation updated (if applicable)
- ✅ Tests added/updated (if applicable)

---

## Issue Reporting

### Bug Reports
Use the bug report template:

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. macOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

### Feature Requests
Use the feature request template:

```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

### Security Issues
For security vulnerabilities:
- **DO NOT** open a public issue
- Email: security@studyconnect.com
- Include detailed description and reproduction steps
- We will respond within 48 hours

---

## Documentation

### Documentation Standards
- Use clear, concise language
- Include code examples where applicable
- Keep documentation up-to-date with code changes
- Use proper Markdown formatting

### API Documentation
- Document all endpoints with request/response examples
- Include authentication requirements
- Specify error responses and status codes
- Update OpenAPI/Swagger specifications

### Code Documentation
- Add JSDoc comments for complex functions
- Document component props with TypeScript interfaces
- Include usage examples in component stories
- Document environment variables and configuration

### README Updates
- Keep installation instructions current
- Update feature lists when adding new functionality
- Maintain accurate technology stack information
- Include troubleshooting for common issues

---

## Getting Help

### Communication Channels
- **Discord**: [StudyConnect Development Server]
- **GitHub Discussions**: For questions and community discussions
- **Email**: dev@studyconnect.com for development questions

### Resources
- **Documentation**: `/docs` directory
- **API Reference**: `docs/API.md`
- **Setup Guide**: `docs/SETUP.md`
- **Architecture Overview**: Main README.md

### Mentorship
New contributors can request mentorship:
- **Frontend Development**: React/TypeScript guidance
- **Backend Development**: Node.js/PostgreSQL help
- **Database Design**: Schema optimization and best practices
- **DevOps**: Deployment and infrastructure setup

---

## Recognition

### Contributors
We maintain a contributors file recognizing all contributions:
- Code contributions
- Documentation improvements
- Bug reports and feature requests
- Community support and mentorship

### Hall of Fame
Outstanding contributors may be featured:
- **Top Contributors**: Monthly recognition
- **Community Champions**: Helpful community members
- **Innovation Awards**: Creative solutions and features

---

## License

By contributing to StudyConnect, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to StudyConnect! Your efforts help make this platform better for students everywhere. 🎓✨