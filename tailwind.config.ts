import type { Config } from "tailwindcss";

// Colours/fonts are CSS variables injected from the database (see layout.tsx).
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        surface: "var(--background)",
      },
      borderRadius: { btn: "var(--button-radius)" },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
