# My Vue App

A modern web application built with Vue 3, Vite, and TypeScript, featuring Tailwind CSS, Headless UI, Element Plus, Pinia, and VueUse. This project follows a modular, maintainable structure with performance optimization in mind.

## Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Mobile-first)
- **UI Libraries**: Headless UI (Vue), Element Plus
- **State Management**: Pinia
- **Utilities**: VueUse

## Prerequisites

- Node.js (v22 or higher)
- npm (v10 or higher)

## Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── assets/           # Static assets (e.g., style.css)
├── components/       # Reusable components
├── composables/      # Composables (e.g., useCounter.ts)
├── constants/        # Static content
├── layouts/          # Layout components
├── stores/          # Pinia store modules
├── types/           # TypeScript interfaces
├── utils/           # Utility functions
├── App.vue          # Root component
├── main.ts          # Entry point
└── vite-env.d.ts    # Vite TypeScript env
```

## Development Guidelines

- **Code Style**: Use concise, declarative TypeScript with functional patterns
- **File Naming**:
  - Components: PascalCase (e.g., `MyComponent.vue`)
  - Directories: lowercase with dashes (e.g., `my-component`)
- **Composables**: Prefix with `use` (e.g., `useFetch.ts`)
- **Types**: Use interfaces over types, avoid enum
- **Styling**: Leverage Tailwind CSS with a mobile-first approach
- **Components**: Follow SFC pattern with `<script setup>`

## Features

- Vue 3 Composition API with TypeScript
- Vite for fast development and building
- Tailwind CSS for utility-first styling
- Headless UI and Element Plus for UI components
- Pinia for state management
- VueUse for composable utilities
- Mobile-first responsive design
- Performance optimizations
- Type-safe development

## Next Steps

- [ ] Add Vue Router for navigation
- [ ] Implement a Pinia store for state management
- [ ] Enable dark mode with Tailwind CSS
- [ ] Optimize performance with lazy loading and `<Suspense>`
