import type { Config } from "@react-router/dev/config";

// Get base path from environment variables (same logic as vite.config.ts)
function getBasePath(): string {
  if (process.env.VITE_BASE_PATH) {
    return process.env.VITE_BASE_PATH;
  }
  if (process.env.GITHUB_REPOSITORY) {
    const repo = process.env.GITHUB_REPOSITORY.split("/")[1];
    return `/${repo}/`;
  }
  return "/";
}

export default {
  ssr: false,
  basename: import.meta.env.PROD ? getBasePath() : "/",
} satisfies Config;
