import type { Config } from "tailwindcss";
import KobalteTailwindPlugin from "@kobalte/tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [KobalteTailwindPlugin],
};

export default config;
