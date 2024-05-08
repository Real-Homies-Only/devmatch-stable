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
        "primary": "#32D8C5",
        "secondary": "#8FCAEA",
        "accent": "#67A6E2",
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
          primary: "#32D8C5",
          secondary: "#8FCAEA",
          accent: "#67A6E2",
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
