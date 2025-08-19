import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";

export default defineConfig(({ mode }) => ({
  plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
  test: {
    coverage: {
      exclude: ["src/**/*.d.ts"],
      include: ["src/**/*.{svelte,ts}"],
    },
    environment: "jsdom",
    globals: true,
    setupFiles: [resolve(__dirname, "tests/setup.ts")],
  },
  resolve: {
    conditions: mode === "test" ? ["browser"] : undefined,
  },
}));
