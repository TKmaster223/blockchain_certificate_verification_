# Contributing to Blockchain Certificate Verification System

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

We welcome contributions from the community! Here are some ways you can help:

- 🐛 Report bugs and issues
- 💡 Suggest new features or enhancements
- 📝 Improve documentation
- 🔧 Submit bug fixes
- ✨ Add new features
- 🧪 Write tests
- 🎨 Improve UI/UX

## 🚀 Getting Started

1. **Fork the repository**
   - Click the "Fork" button in the top right of the repository page

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/blockchain_certificate_verification_.git
   cd blockchain_certificate_verification_
   ```

3. **Set up the development environment**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Start services with Docker
   docker-compose up -d
   ```

4. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 💻 Development Workflow

### Making Changes

1. **Make your changes**
   - Write clear, commented code
   - Follow the existing code style
   - Keep changes focused and atomic

2. **Test your changes**
   ```bash
   # Backend tests
   docker-compose exec backend python -m pytest
   
   # Manual testing
   curl http://localhost:8000/health
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

### Commit Message Guidelines

Use conventional commit format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat: add certificate expiration validation
fix: resolve JWT token expiration issue
docs: update API documentation
```

### Submitting Changes

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template with details
   - Submit the PR

## 📋 Pull Request Guidelines

### Before Submitting

- ✅ Code follows the project's style guidelines
- ✅ All tests pass
- ✅ No new warnings or errors
- ✅ Documentation is updated (if needed)
- ✅ Commit messages are clear and descriptive
- ✅ Branch is up to date with main

### PR Description Should Include

- **What**: Description of changes
- **Why**: Reason for the changes
- **How**: Technical details (if complex)
- **Testing**: How you tested the changes
- **Screenshots**: For UI changes

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported
2. Try to reproduce the bug in the latest version
3. Gather relevant information (logs, screenshots, etc.)

### Bug Report Should Include

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: OS, browser, Docker version, etc.
- **Logs/Screenshots**: Any relevant logs or screenshots

## 💡 Suggesting Features

When suggesting a new feature:

1. **Check existing issues** to avoid duplicates
2. **Describe the feature** clearly and in detail
3. **Explain the use case** and why it's valuable
4. **Consider the impact** on existing functionality
5. **Propose an implementation** if you have ideas

## 🎨 Code Style Guidelines

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints where appropriate
- Write docstrings for functions and classes
- Keep functions focused and small
- Use meaningful variable names

Example:
```python
def verify_certificate(certificate_hash: str) -> dict:
    """
    Verify a certificate by its hash.
    
    Args:
        certificate_hash: The SHA-256 hash of the certificate
        
    Returns:
        dict: Verification result with status and details
    """
    # Implementation
    pass
```

### JavaScript/TypeScript (Frontend)

- Use ESLint configuration
- Follow Vue.js style guide
- Use TypeScript types
- Write clear component names
- Keep components small and focused

### General Guidelines

- Use clear, descriptive names
- Add comments for complex logic
- Keep functions under 50 lines
- Avoid deep nesting (max 3 levels)
- Write self-documenting code

## 🧪 Testing

### Writing Tests

- Write tests for new features
- Update tests for bug fixes
- Aim for good test coverage
- Test edge cases and error conditions

### Running Tests

```bash
# Backend tests
docker-compose exec backend python -m pytest

# Run specific test
docker-compose exec backend python -m pytest tests/test_auth.py

# With coverage
docker-compose exec backend python -m pytest --cov=backend
```

## 🔒 Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities!

Instead:
1. Email the maintainers directly
2. Provide detailed information about the vulnerability
3. Allow time for a fix before public disclosure

### Security Best Practices

- Never commit secrets or credentials
- Use environment variables for sensitive data
- Validate and sanitize all inputs
- Follow OWASP security guidelines
- Keep dependencies updated

## 📚 Documentation

### Updating Documentation

When making changes:
- Update README.md if needed
- Update API documentation
- Add inline code comments
- Update changelog
- Update relevant guides

### Documentation Style

- Use clear, simple language
- Include code examples
- Add screenshots for UI changes
- Keep formatting consistent
- Test all commands and examples

## ❓ Questions?

If you have questions:
- Check existing issues and discussions
- Read the documentation
- Ask in the issue comments
- Contact maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

---

**Happy Contributing! 🎉**
