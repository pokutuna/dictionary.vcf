# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

This is a template repository for building single-page applications (SPAs) with React Router v7, TypeScript, and Tailwind CSS. The template is pre-configured for deployment to GitHub Pages.

## Architecture

- **React Router v7 SPA**: Frontend application built with React Router for client-side routing
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS v4**: Utility-first CSS framework with modern features
- **Vite 7**: Fast build tool and development server

### Key Files

- `app/routes/`: Route components (page components)
- `app/root.tsx`: Root layout with HTML structure
- `app/routes.ts`: Route configuration
- `app/app.css`: Global styles and Tailwind configuration
- `vite.config.ts`: Vite configuration (includes base path for GitHub Pages)
- `react-router.config.ts`: React Router configuration

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Preview production build
npm run preview

# Start production server
npm start
```

## Common Development Tasks

### Adding a New Route

1. Create a new file in `app/routes/` (e.g., `app/routes/about.tsx`)
2. Export a default component from the file
3. Add the route to `app/routes.ts`

### Updating Styles

- Global styles: Edit `app/app.css`
- Component styles: Use Tailwind utility classes directly in components

### Configuring for GitHub Pages

Update the `base` path in `vite.config.ts` to match your repository name:

```typescript
base: mode === "production" ? "/your-repo-name/" : "/"
```

## Deployment

This template is configured for GitHub Pages deployment. The build output directory is `build/client/`, which should be deployed to the `gh-pages` branch or configured in repository settings.

## Technology Stack

- React Router v7 - Client-side routing
- React 19 - UI library
- TypeScript - Type safety
- Tailwind CSS v4 - Styling
- Vite 7 - Build tool
- Lucide React - Icons

## Best Practices

- Keep route components in `app/routes/`
- Use TypeScript types for all props and state
- Leverage Tailwind utility classes for styling
- Follow React Router v7 conventions for data loading and mutations
- Use the Route.MetaArgs type for page metadata
