import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        analyst: { bg: "#ffffff", primary: "#1e40af", accent: "#0ea5e9", text: "#0f172a" },
        elderly: { bg: "#fffbeb", primary: "#7c2d12", accent: "#b45309", text: "#1c1917" },
        kiosk: { bg: "#ecfdf5", primary: "#047857", accent: "#10b981", text: "#064e3b" },
      },
      fontSize: {
        "ucd-base": "16px",
        "ucd-lg": "18px",
        "ucd-xl": "22px", 
        "ucd-2xl": "28px",
        "ucd-3xl": "36px",
        "ucd-kiosk": "24px",
      },
    },
  },
  plugins: [],
};
export default config;