import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Design System Palette ── */
        navy: {
          DEFAULT: "#0B2A4A",
          50: "#E8F0F7",
          100: "#C5D9EA",
          200: "#8BB3D1",
          300: "#5D8FA3",
          400: "#3D6E8A",
          500: "#0B2A4A",
          600: "#091F37",
          700: "#071D33",
          800: "#051525",
          900: "#030C17",
        },
        turquoise: {
          DEFAULT: "#63B7B2",
          50: "#EEF8F7",
          100: "#D5EFED",
          200: "#A8D5D1",
          300: "#74C5C0",
          400: "#63B7B2",
          500: "#4A9E99",
          600: "#3A7D79",
          700: "#2B5D5A",
        },
        cream: {
          DEFAULT: "#F6F3EC",
          50: "#FDFCFA",
          100: "#F6F3EC",
          200: "#EDE8DD",
          300: "#E0D8C8",
        },
        /* ── Semantic ── */
        sage: {
          DEFAULT: "#8DB596",
          light: "#B5D1BA",
          dark: "#6A9A73",
        },
        coral: {
          DEFAULT: "#D96C6C",
          light: "#E48585",
          dark: "#C15555",
        },
        amber: {
          DEFAULT: "#E4B363",
          light: "#EDCA82",
          dark: "#D09A40",
        },
        /* ── Legacy mode support ── */
        analyst: { bg: "#FAFBFC", primary: "#0B2A4A", accent: "#63B7B2", text: "#0B2A4A" },
        elderly: { bg: "#F6F3EC", primary: "#0B2A4A", accent: "#5D8FA3", text: "#0B2A4A" },
        kiosk: { bg: "#F6F3EC", primary: "#0B2A4A", accent: "#63B7B2", text: "#0B2A4A" },
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