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

This template is pre-configured for GitHub Pages deployment:

1. Update the `base` path in `vite.config.ts` if your repository name is different
2. Build your application:

```bash
npm run build
```

3. Deploy the `build/client` directory to GitHub Pages

### Automated Deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build/client
```

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

### Updating the Base Path

If deploying to a GitHub Pages project site (not a user/organization site), update the base path in `vite.config.ts`:

```typescript
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/your-repo-name/" : "/",
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
}));
```

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
