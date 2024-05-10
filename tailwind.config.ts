import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1a97f2",
        "secondary": "#084599",
        "accent": "#85d014",
        "background": "#FAFEFE",
        "letter": "#020B0A"
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        "light": {
          primary: "#1a97f2",
          secondary: "#084599",
          accent: "#85d014",
          background: "#FAFEFE",
          letter: "#020B0A",
          gray: "#4A4A4A"
        }
      }
    ],
    darkTheme: "dark",
    base: false,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root"
  }
};
export default config;
