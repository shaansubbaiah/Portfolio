import handlebars from "vite-plugin-handlebars";
import config from "./config.json";
import githubData from "./github-data.json";

export default {
  plugins: [
    handlebars({
      context: {
        cfg: config,
        dt: githubData,
      },
    }),
  ],
};
