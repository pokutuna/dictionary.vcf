import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  // prerender: true,
  // https://github.com/remix-run/react-router/pull/13791
  basename: import.meta.env.PROD ? "/dictionary.vcf/" : "/",
} satisfies Config;
