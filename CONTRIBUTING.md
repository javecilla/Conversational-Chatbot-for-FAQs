# Contributing to Conversational Chatbot for FAQs

Thank you for your interest in contributing to this project! This document provides guidelines and steps for contributing.

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── assets/         # Static assets like images, fonts
├── components/     # Vue components
├── stores/        # Pinia stores
├── types/         # TypeScript type definitions
└── views/         # Vue views/pages
```

## Coding Standards

- Use TypeScript for type safety
- Follow Vue 3 Composition API patterns
- Use Tailwind CSS for styling
- Maintain consistent formatting using your editor's settings

## Commit Guidelines

Format your commit messages as:
```
type(scope): description

[optional body]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting, etc)
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance tasks

## Pull Request Process

1. Create a new branch for your feature/fix:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them following the commit guidelines

3. Push to your fork and submit a pull request

4. Ensure your PR description clearly describes the changes and their purpose

## Development Guidelines

- Write clean, maintainable, and reusable code
- Add appropriate comments for complex logic
- Update documentation when needed
- Add tests for new features when applicable
- Ensure all tests pass before submitting PR

## Getting Help

If you need help with anything, please:
- Create an issue with detailed information
- Reach out to project maintainers
- Check existing documentation and issues

Thank you for contributing!
