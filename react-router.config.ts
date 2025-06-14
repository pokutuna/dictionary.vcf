import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  prerender: true,
  basename: "/dictionary.vcf",
} satisfies Config;
