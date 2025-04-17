import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    solidPlugin(),
    tailwindcss(),
  ],
  assetsInclude: ["**/*.geojson"],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
