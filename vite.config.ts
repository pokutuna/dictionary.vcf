import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  // GitHub Pages base path configuration
  // Priority: VITE_BASE_PATH env var > GitHub repo name (from GITHUB_REPOSITORY) > "/"
  let base = "/";

  if (mode === "production") {
    if (process.env.VITE_BASE_PATH) {
      // Use explicitly set base path
      base = process.env.VITE_BASE_PATH;
    } else if (process.env.GITHUB_REPOSITORY) {
      // Auto-detect from GitHub Actions (format: "owner/repo")
      const repo = process.env.GITHUB_REPOSITORY.split("/")[1];
      base = `/${repo}/`;
    }
    // For user/organization sites (username.github.io), set VITE_BASE_PATH="/"
  }

  return {
    base,
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  };
});
