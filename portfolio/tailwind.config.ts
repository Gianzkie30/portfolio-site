import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#17161a", paper: "#faf8f4", line: "#e7e2d8", accent: "#c2410c", accentdark: "#9a3412" },
      fontFamily: { display: ["Georgia", "'Times New Roman'", "serif"], sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
