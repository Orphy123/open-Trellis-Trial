/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ea580c",
          hover: "#c2410c",
        },
        secondary: "#64748b",
      },
      spacing: {
        section: "2rem",
        container: "1rem",
      },
      borderRadius: {
        container: "0.75rem",
      },
    },
  },
  plugins: [],
};
