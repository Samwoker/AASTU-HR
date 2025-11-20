/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "k-orange": "#db602c",
        "k-yellow": "#fecd30",
        "k-dark-grey": "#333333",
        "k-medium-grey": "#888888",
        "k-light-grey": "#f5f5f5",
        "k-white": "#ffffff",
      },
      fontFamily: {
        sans: [
          "var(--font-family-base)",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        base: [
          "var(--font-family-base)",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        heading: ["var(--font-family-heading)", "system-ui", "sans-serif"],
        display: ["var(--font-family-display)", "system-ui", "sans-serif"],
        accent: ["var(--font-familyaccent)", "system-ui", "sans-serif"],
      },
      fontSize: {
        body: "16px",
        h1: "32px",
        h2: "24px",
        h3: "20px",
        label: "14px",
      },
    },
  },
  plugins: [],
};
