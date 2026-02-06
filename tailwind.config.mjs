/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Warm paper-like cream tones
        paper: {
          50: "#fdfcfa",
          100: "#f9f6f1",
          200: "#f2ebe0",
          300: "#e8dcc9",
          400: "#d4c4a8",
        },
        // Deep, warm ink colors
        ink: {
          400: "#6b5d52",
          500: "#5a4d43",
          600: "#463b33",
          700: "#352d27",
          800: "#261f1a",
          900: "#1a1512",
        },
        // Accent: terracotta/rust
        terra: {
          400: "#c96442",
          500: "#b85636",
          600: "#9a4730",
        },
        // Secondary accent: forest sage
        sage: {
          400: "#7a9477",
          500: "#5f7a5c",
          600: "#4d644b",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      animation: {
        fadeIn: "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        slideUp: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        stagger: "stagger 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        stagger: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
