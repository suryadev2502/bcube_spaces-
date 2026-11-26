import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0E0E0F", 900: "#0E0E0F", 800: "#18181A", 700: "#232326", 600: "#2F2F33", 500: "#4A4A50" },
        charcoal: "#2B2B2E",
        stone: { 50: "#FAF9F7", 100: "#F4F2EE", 200: "#E8E4DC", 300: "#D6D0C4", 400: "#A9A396", 500: "#7C776C" },
        gold: { DEFAULT: "#B8945A", 50: "#FAF5EC", 100: "#F2E7D2", 200: "#E4CEA4", 300: "#D4B47C", 400: "#C6A46A", 500: "#B8945A", 600: "#9C7A44", 700: "#7A5E33" },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Manrope Variable"', "system-ui", "sans-serif"],
      },
      letterSpacing: { luxe: "0.28em" },
      boxShadow: {
        card: "0 1px 2px rgba(14,14,15,.04), 0 12px 32px -12px rgba(14,14,15,.14)",
        lift: "0 2px 4px rgba(14,14,15,.05), 0 28px 60px -20px rgba(14,14,15,.28)",
      },
      maxWidth: { site: "1320px" },
    },
  },
  plugins: [],
} satisfies Config;
