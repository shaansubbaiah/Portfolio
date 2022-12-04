import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import config from "./config.json";
import githubData from "./github-data.json";

export default defineConfig({
  root: "src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  base: "/",
  plugins: [
    handlebars({
      context: {
        cfg: config,
        dt: githubData,
      },
    }),
  ],
});
