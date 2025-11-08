# React Router SPA Template

A modern, production-ready template for building single-page applications with React Router v7, TypeScript, and Tailwind CSS. Pre-configured for GitHub Pages deployment.

## Features

- **React Router v7** - Latest version with modern routing capabilities
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vite 7** - Lightning-fast build tool
- **GitHub Pages Ready** - Pre-configured for seamless deployment
- **ESLint & TypeScript** - Code quality and type checking
- **Modern React 19** - Latest React features

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Use this template or clone the repository:

```bash
git clone https://github.com/your-username/react-router-spa-template.git
cd react-router-spa-template
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking
- `npm run preview` - Preview production build locally

## Deployment to GitHub Pages

This template automatically configures the base path for GitHub Pages deployment.

### Configuration Options

**Option 1: Automatic (Recommended for GitHub Actions)**

The template auto-detects the repository name from `GITHUB_REPOSITORY` environment variable in GitHub Actions. No configuration needed!

**Option 2: Manual Configuration**

For local builds or custom paths, create a `.env` file:

```bash
# For project sites (username.github.io/repo-name/)
VITE_BASE_PATH=/your-repo-name/

# For user/organization sites (username.github.io/)
VITE_BASE_PATH=/
```

### Build and Deploy

```bash
npm run build
```

Deploy the `build/client` directory to GitHub Pages.

### Automated Deployment with GitHub Actions

The repository includes `.github/workflows/deploy-pages.yml` that automatically:
- Detects the repository name
- Builds with the correct base path
- Deploys to GitHub Pages

Just push to the `main` branch and GitHub Actions handles the rest!

## Project Structure

```
.
├── app/
│   ├── routes/          # Route components
│   ├── root.tsx         # Root layout component
│   ├── routes.ts        # Route configuration
│   └── app.css          # Global styles
├── public/              # Static assets
├── vite.config.ts       # Vite configuration
├── react-router.config.ts # React Router configuration
└── tsconfig.json        # TypeScript configuration
```

## Customization

### Adding Routes

1. Create a new file in `app/routes/`
2. Add the route to `app/routes.ts`

Example:

```typescript
// app/routes/about.tsx
export default function About() {
  return <div>About Page</div>;
}
```

```typescript
// app/routes.ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;
```

### Styling

This template uses Tailwind CSS v4. Customize your design system in `app/app.css`.

### Base Path Configuration

The template uses an intelligent base path system:

1. **In GitHub Actions**: Automatically uses the repository name
2. **Locally**: Set `VITE_BASE_PATH` in `.env` file (see `.env.example`)
3. **Default**: Uses `/` for root deployments

See the [Deployment to GitHub Pages](#deployment-to-github-pages) section for details.

## Tech Stack

- [React Router v7](https://reactrouter.com/) - Routing
- [React 19](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS v4](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool
- [Lucide React](https://lucide.dev/) - Icon library

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
